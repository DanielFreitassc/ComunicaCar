import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Container } from '../../../components/Container';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import { api } from '../../../infra/apis/api';
import * as ImagePicker from 'expo-image-picker';

export function Service() {
  const route = useRoute();
  const navigation = useNavigation();

  const [service, setService] = useState(null);
  const [etapas, setEtapas] = useState([]);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [status, setStatus] = useState(route.params?.status || 'PROGRESS');

  useEffect(() => {
    if (route.params?.Service) {
      const serviceData = route.params.Service;
      setService(serviceData);
      setStatus(route.params?.status || serviceData.status || 'PROGRESS');
    }
  }, [route.params]);

  useEffect(() => {
    if (service?.id && service.steps) {
      const etapasComImagens = service.steps.map((step) => ({ ...step }));
      setEtapas([
        ...etapasComImagens,
        {
          title: '',
          description: '',
          serviceId: service.id,
          createdAt: new Date(),
        },
      ]);
    }
  }, [service]);

  // Função unificada para atualizar o status do serviço
  async function updateServiceStatusToReady() {
    if (!service) {
      Alert.alert("Erro", "Serviço não encontrado.");
      return;
    }

    Alert.alert(
      "Confirmar Ação",
      "Deseja realmente marcar o serviço como 'Pronto'?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            const payload = {
              title: service.title,
              clientName: service.clientName,
              description: service.description,
              vehicle: service.vehicle,
              contactNumber: service.contactNumber,
              mechanicId: service.mechanicId?.id,
              conclusionDate: service.conclusionDate,
              status: 'READY',
            };
            const originalStatus = status;
            setStatus('READY');

            try {
              await api.put(`/services/${service.id}`, payload);
              Alert.alert(
                "Sucesso!", 
                "O estado do serviço foi atualizado para 'Pronto'.",
                [
                  {
                    text: "Ok",
                    onPress: () => navigation.goBack(),
                  }
                ]
              );
            } catch (error) {
              setStatus(originalStatus);
              console.error(`Erro ao atualizar para Pronto:`, error.response?.data || error.message);
              Alert.alert("Erro", `Não foi possível atualizar o estado do serviço. Código: ${error.response?.status}`);
            }
          }
        }
      ]
    );
  }
  
  async function handleSave() {
    try {
      const index = editandoIndex !== null ? editandoIndex : etapas.length - 1;
      const etapa = etapas[index];
      if (!etapa.title.trim() || !etapa.description.trim()) return;
      if (editandoIndex !== null && editandoIndex !== etapas.length - 1) {
        return await editarEtapa(etapa);
      }
      return await salvarNovaEtapa(etapa);
    } catch (error) {
      Alert.alert("Atenção!", `Ocorreu um erro ao salvar etapa! ${error}`);
    }
  }

  async function salvarNovaEtapa(etapa) {
    const dto = {
      title: etapa.title,
      description: etapa.description,
      serviceId: service.id,
    };
    const { data } = await api.post("/steps", dto);
    const novaEtapas = [...etapas];
    novaEtapas[etapas.length - 1] = data;
    novaEtapas.push({
      serviceId: service.id,
      title: '',
      description: '',
      createdAt: new Date(),
    });
    setEtapas(novaEtapas);
    setEditandoIndex(null);
  }

  async function editarEtapa(etapa) {
    const dto = {
      title: etapa.title,
      description: etapa.description,
      serviceId: service.id,
    };
    const { data } = await api.put(`/steps/${etapa.id}`, dto);
    const novasEtapas = [...etapas];
    novasEtapas[editandoIndex] = data;
    setEtapas(novasEtapas);
    setEditandoIndex(null);
  }

  function handleDelete(index) {
    Alert.alert('Remover etapa', 'Deseja realmente remover esta etapa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletarEtapa(etapas[index]);
          } catch (error) {
            Alert.alert("Atenção!", `Ocorreu um erro ao remover etapa! ${error?.message}`);
          }
        },
      },
    ]);
  }

  async function deletarEtapa(etapa) {
    await api.delete(`/steps/${etapa.id}`);
    const novasEtapas = etapas.filter(e => e.id !== etapa.id);
    const ultimaEtapa = novasEtapas[novasEtapas.length - 1];
    if (!ultimaEtapa || ultimaEtapa.title || ultimaEtapa.description) {
      novasEtapas.push({
        serviceId: service.id,
        title: '',
        description: '',
        createdAt: new Date(),
      });
    }
    setEtapas(novasEtapas);
    setEditandoIndex(null);
  }

  function handleEdit(index) {
    setEditandoIndex(index);
  }

  // ========================================================================
  // INÍCIO DA CORREÇÃO
  // ========================================================================
  async function handleImagemEtapa(index) {
    const etapa = etapas[index];

    // Uma etapa precisa ser salva (ter um ID) antes de poder adicionar imagens.
    if (!etapa.id) {
      Alert.alert("Atenção", "Você precisa salvar a etapa antes de adicionar imagens.");
      return;
    }

    // A lógica agora é sempre navegar para a tela 'Images'.
    // Essa tela já é capaz de lidar com etapas com ou sem imagens,
    // e possui o botão para adicionar novas fotos.
    navigation.navigate('Mecanico', {
      screen: 'Images', // CORREÇÃO: Navegar para a tela de Imagens
      params: {
        // Passando os parâmetros corretos que a tela 'Images' espera
        imageIds: etapa.imageIds || [],
        stepId: etapa.id,
      },
    });
  }
  // ========================================================================
  // FIM DA CORREÇÃO
  // ========================================================================

  async function enviarNovaImagem(index) {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') { Alert.alert('Permissão negada', '...'); return; }
      const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 1 });
      if (result.canceled) return;

      const novasEtapas = [...etapas];
      const etapa = novasEtapas[index];
      const imageUri = result.assets[0].uri;
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      const formData = new FormData();
      formData.append('stepId', etapa.id);
      formData.append('image', { uri: imageUri, name: `etapa-${etapa.id}.${fileType}`, type: `image/${fileType}` });

      const { data } = await api.post('/media', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      etapa.imageIds = [...(etapa?.imageIds || []), data?.id];
      novasEtapas[index] = etapa;
      setEtapas(novasEtapas);
      Alert.alert('Sucesso', 'Imagem enviada com sucesso!');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao enviar imagem.');
    }
  }

  const isReady = status === 'READY';

  if (!service) return <Container><Text>Serviço não encontrado</Text></Container>;

  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{service.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.card, isReady && styles.concludedCard]}>
          <Text style={styles.label}>Veículo:</Text>
          <Text style={styles.value}>{service.vehicle}</Text>

          <Text style={styles.label}>Descrição:</Text>
          <Text style={styles.value}>{service.description}</Text>
          
          <Text style={styles.label}>Status Atual:</Text>
          <Text style={styles.statusValue}>{status}</Text>
        </View>

        {etapas.map((etapa, index) => {
          const isUltima = index === etapas.length - 1;
          const isEditing = !isReady && ((editandoIndex !== null && index === editandoIndex) || (editandoIndex === null && isUltima));

          return (
            <View style={[styles.card, isReady && styles.concludedCard]} key={index}>
              <View style={styles.etapaHeader}>
                <Text style={styles.sectionTitle}>Etapa {index + 1}</Text>
                {!isUltima && (
                  <View style={styles.icons}>
                    <TouchableOpacity onPress={updateServiceStatusToReady} disabled={isReady}>
                      <Feather name="check-circle" size={24} color={isReady ? '#AAA' : '#28A745'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleEdit(index)} style={{ marginLeft: 12 }} disabled={isReady}>
                      <Feather name="edit" size={24} color={isReady ? '#AAA' : '#555'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleImagemEtapa(index)} style={{ marginLeft: 12 }} disabled={isReady}>
                      <Feather name="camera" size={24} color={isReady ? '#AAA' : '#007AFF'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(index)} style={{ marginLeft: 12 }} disabled={isReady}>
                      <Feather name="trash" size={24} color={isReady ? '#AAA' : '#E91E63'} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <TextInput
                style={[styles.input, !isEditing && styles.disabledInput]}
                placeholder="Título da etapa" value={etapa.title}
                onChangeText={(text) => {
                  const novasEtapas = [...etapas];
                  novasEtapas[index].title = text;
                  setEtapas(novasEtapas);
                }}
                editable={isEditing}
              />
              <TextInput
                style={[styles.input, { height: 80 }, !isEditing && styles.disabledInput]}
                placeholder="Descrição da etapa" multiline value={etapa.description}
                onChangeText={(text) => {
                  const novasEtapas = [...etapas];
                  novasEtapas[index].description = text;
                  setEtapas(novasEtapas);
                }}
                editable={isEditing}
              />
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={[styles.button, isReady && styles.disabledButton]} onPress={handleSave} disabled={isReady}>
        <Text style={styles.buttonText}>
          {editandoIndex !== null && editandoIndex !== etapas.length - 1 ? `Editar etapa ${editandoIndex + 1}` : 'Salvar etapa'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.finalizarButton, isReady && styles.disabledButton]}
        onPress={updateServiceStatusToReady}
        disabled={isReady}
      >
        <Text style={styles.buttonText}>Finalizar serviço</Text>
      </TouchableOpacity>
    </Container>
  );
}

// Seus estilos permanecem os mesmos
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
    color: '#333',
  },
  scroll: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  label: {
    fontWeight: '600',
    color: '#555',
    marginTop: 8,
  },
  value: {
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderColor: '#CCC',
    borderWidth: 1,
    padding: 10,
    marginTop: 12,
    color: '#333',
  },
  disabledInput: {
    backgroundColor: '#EEE',
    color: '#999',
  },
  disabledButton: { // Estilo para desabilitar botões
    backgroundColor: '#AAA',
  },
  concludedCard: { // Estilo para cards quando o serviço está concluído
    backgroundColor: '#E0E0E0',
  },
  statusValue: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  button: {
    backgroundColor: '#E91E63',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  finalizarButton: {
    backgroundColor: '#007AFF',
    marginBottom: 32,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  etapaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icons: {
    flexDirection: 'row',
  },
});