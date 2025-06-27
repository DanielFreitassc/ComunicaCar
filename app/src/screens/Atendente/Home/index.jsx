import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  FlatList,
  Alert,
  Modal,
  Share,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import QRCodeSVG from 'react-native-qrcode-svg';
import { Container } from '../../../components/Container';
import { api, vercelApi } from '../../../infra/apis/api';
import { useAuth } from '../../../hooks/authHook';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_MARGIN = 16;

export function Home() {
  const { logout } = useAuth();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  function cadastrar() {
    navigation.navigate('CreateService');
  }

  const getServices = useCallback(async (searchTerm = '') => {
    try {
      setIsLoading(true);
      const params = {
        page: 0,
        limit: 9999,
      };

      if (searchTerm) {
        params.client = searchTerm;
      }

      const { data } = await api.get('/services', { params });

      const statusMap = {
        "Pendente": "PENDING",
        "Em andamento": "PROGRESS",
        "Em progresso": "PROGRESS",
        "Pronto": "READY",
      };

      const translatedServices = (data.content || []).map(service => ({
        ...service,
        status: statusMap[service.status] || service.status,
      }));

      setServices(translatedServices);

    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      Alert.alert('Atenção', 'Ocorreu um erro ao recuperar os atendimentos.');
    } finally {
      setIsLoading(false);
    }
  }, []); 


  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      getServices(search);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [search, getServices]); 

  useFocusEffect(
    useCallback(() => {

      getServices(search);
    }, [search, getServices])
  );


  async function updateServiceStage(serviceId, newStatus) {
    const originalServices = [...services];
    const serviceToUpdate = services.find(s => s.id === serviceId);
    if (!serviceToUpdate) return;

    const payload = {
      title: serviceToUpdate.title || '',
      clientName: serviceToUpdate.clientName || '',
      description: serviceToUpdate.description || '',
      vehicle: serviceToUpdate.vehicle || '',
      contactNumber: serviceToUpdate.contactNumber || '',
      conclusionDate: serviceToUpdate.conclusionDate || '',
      mechanicId: serviceToUpdate.mechanicId?.id, 
      status: newStatus, 
    };
    
    setServices(prev => 
      prev.map(s => (s.id === serviceId ? { ...s, status: newStatus } : s))
    );

    try {
      await api.put(`/services/${serviceId}`, payload);
    } catch (error) {
      console.error("Erro ao atualizar o serviço:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível atualizar a etapa.");
      setServices(originalServices);
    }
  }

  function handleEdit(service) {
    navigation.navigate('EditService', { service: service });
  }

  async function handleDelete(serviceId) {
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza que deseja apagar este atendimento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          onPress: async () => {
            try {
              await api.delete(`/services/${serviceId}`);
              setServices(prevServices => prevServices.filter(service => service.id !== serviceId));
              Alert.alert("Sucesso", "Atendimento apagado.");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível apagar o atendimento.");
            }
          },
          style: "destructive"
        }
      ]
    );
  }

  const handleGenerateQrCode = (service) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  const handleShare = async (serviceId) => {
    const shareableLink = `${vercelApi.defaults.baseURL}/order/${serviceId}`;
    try {
      await Share.share({
        message: `Acompanhe o status do seu serviço: ${shareableLink}`,
        url: shareableLink,
        title: 'Acompanhar Ordem de Serviço'
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar o link.');
    }
  };

  const selectedServiceUrl = selectedService ? `${vercelApi.defaults.baseURL}/order/${selectedService.id}` : '';

  return (
    <Container>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Atendimentos</Text>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={24} color="#E91E63" />
          </TouchableOpacity>
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search-outline" size={20} color="#999" />
            <TextInput 
              style={styles.searchInput} 
              placeholder="Buscar por nome do cliente..." 
              placeholderTextColor="#999" 
              value={search} 
              onChangeText={setSearch} 
            />
          </View>
          <TouchableOpacity style={styles.newButton} onPress={cadastrar}>
            <Text style={styles.newButtonText}>Cadastrar novo atendimento</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          contentContainerStyle={styles.cardsContainer}

          data={services}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={() => getServices(search)}
          refreshing={isLoading}
          ListEmptyComponent={() => (
            <View style={styles.emptyListContainer}>
              <Text style={styles.emptyListText}>
                {isLoading ? 'Buscando...' : (search ? 'Nenhum cliente encontrado.' : 'Não há atendimentos cadastrados.')}
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <FontAwesome5 name="user-circle" size={40} color="#999" />
                <View style={styles.cardHeaderText}>
                    <Text style={styles.cardName}>{item.clientName}</Text>
                    <Text style={styles.cardTicket}>Ticket: {item.ticketNumber}</Text>
                </View>
              </View>
              <View style={styles.cardRow}><Text style={styles.cardLabel}>Veículo:</Text><Text style={styles.cardValue}>{item.vehicle}</Text></View>
              <View style={styles.cardRow}><Text style={styles.cardLabel}>Título:</Text><Text style={styles.cardValue}>{item.title}</Text></View>
              <View style={styles.cardRow}><Text style={styles.cardLabel}>Descrição:</Text><Text style={styles.cardValue} numberOfLines={2}>{item.description}</Text></View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Previsão:</Text>
                <View style={styles.dateInput}><Text style={styles.dateText}>{item.conclusionDate || '—'}</Text><MaterialIcons name="calendar-today" size={18} color="#999" /></View>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Etapa:</Text>
                <View style={styles.pickerWrapper}>
                  <Picker 
                    selectedValue={item.status}
                    onValueChange={(value) => updateServiceStage(item.id, value)} 
                    style={styles.picker} 
                    dropdownIconColor="#999"
                  >
                    <Picker.Item label="Pendente" value="PENDING" />
                    <Picker.Item label="Em andamento" value="PROGRESS" />
                    <Picker.Item label="Pronto" value="READY" />
                  </Picker>
                </View>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleGenerateQrCode(item)}><Text style={styles.actionText}>QR Code</Text></TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(item)}><Text style={styles.actionText}>Editar</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDelete(item.id)}><Text style={styles.actionText}>Apagar</Text></TouchableOpacity>
              </View>
            </View>
          )}
        />
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { setModalVisible(!modalVisible); setSelectedService(null); }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Acompanhar Serviço</Text>
              {selectedService && (
                <>
                  <View style={styles.qrCodeContainer}><QRCodeSVG value={selectedServiceUrl} size={220} /></View>
                  <Text style={styles.modalText}>Link de acompanhamento:</Text>
                  <TextInput style={styles.linkInput} value={selectedServiceUrl} editable={false} multiline />
                  <TouchableOpacity style={[styles.modalButton, styles.shareButton]} onPress={() => { handleShare(selectedService.id); setModalVisible(false); }}>
                    <Text style={styles.modalButtonText}>Compartilhar Link</Text>
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity style={[styles.modalButton, styles.closeButton]} onPress={() => { setModalVisible(!modalVisible); setSelectedService(null); }}>
                <Text style={styles.modalButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: HORIZONTAL_MARGIN,
    backgroundColor: '#fff',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E91E63',
  },
  logoutButton: {
    position: 'absolute',
    right: HORIZONTAL_MARGIN,
    alignSelf: 'center',
  },
  controlsContainer: {
    paddingHorizontal: HORIZONTAL_MARGIN,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 48,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  newButton: {
    backgroundColor: '#E91E63',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  newButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cardsContainer: {
    paddingTop: 20,
    paddingHorizontal: HORIZONTAL_MARGIN,
    paddingBottom: 40,
  },
  emptyListContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  emptyListText: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  cardTicket: {
    fontSize: 14,
    color: '#666',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  cardLabel: {
    width: 80,
    fontWeight: '600',
    color: '#555',
    fontSize: 14,
  },
  cardValue: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: '#333',
    fontSize: 14,
  },
  dateInput: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    color: '#333',
    fontSize: 14,
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    justifyContent: 'center',
    ...(Platform.OS === 'android' && {
      height: 48,
    }),
  },
  picker: {
    width: '100%',
    color: '#333',
    ...(Platform.OS === 'ios' && {
      height: 48,
    }),
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#E91E63',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#8B0000',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    margin: 20,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  qrCodeContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  modalText: {
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
    color: '#555'
  },
  linkInput: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    padding: 10,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  modalButton: {
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    width: '100%',
    marginBottom: 10,
  },
  shareButton: {
    backgroundColor: '#E91E63',
  },
  closeButton: {
    backgroundColor: '#999',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
