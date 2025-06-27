import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';

import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../../hooks/authHook';

import { Container } from '../../../components/Container';
import { api } from '../../../infra/apis/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export function Home() {

  const navigation = useNavigation();
  const { logout } = useAuth();

  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');

  // useEffect para buscar informações do usuário apenas uma vez
  useEffect(() => {
    async function getUserInfo() {
      try {
        const { data } = await api.get("/users/info");
        if (data && data.name) {
          setUserName(data.name);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        Alert.alert("Atenção", "Não foi possível carregar o nome do usuário.", "Ok");
      }
    }
    getUserInfo();
  }, []);

  /**
   * Fetches the list of services in progress.
   */
  async function getServices() {
    try {
      setIsLoading(true);
      const { data } = await api.get("/services", {
        params: {
          page: 0,
          limit: 9999,
          status: "PROGRESS"
        }
      });
      setServices(data.content);
    } catch (error) {
      Alert.alert("Atenção", "Ocorreu um erro ao recuperar os atendimento em andamento!", "Ok");
    } finally {
      setIsLoading(false);
    }
  }

  // useFocusEffect é usado para executar uma ação sempre que a tela entra em foco.
  // Usamos useCallback para evitar que a função seja recriada a cada renderização.
  useFocusEffect(
    useCallback(() => {
      // A função getServices será chamada toda vez que o usuário navegar para esta tela.
      getServices();
    }, [])
  );

  /**
   * Navigates to the service details screen.
   * @param {object} service - The service object to pass to the next screen.
   */
  async function selectService(service) {
    try {
      navigation.navigate('Mecanico', {
        screen: 'Service',
        params: { Service: service },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <FontAwesome5 name="car-side" size={32} color="#E91E63" />
          <Text style={styles.headerText}>
            Olá, {userName}
          </Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={24} color="#E91E63" />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleLeft}>
            <MaterialIcons name="build-circle" size={20} color="#555555" />
            <Text style={styles.sectionTitleText}>Atendimentos em andamento</Text>
          </View>
        </View>

        <FlatList
          data={services}
          renderItem={({ item: service }) =>
            <TouchableOpacity onPress={() => selectService(service)} activeOpacity={0.8}
              key={service.id}
              style={styles.cardContainer}>

              <Text style={styles.cardTitle} numberOfLines={1}>
                {service.title}
              </Text>

              <View style={{ flexDirection: "row", gap: 8 }}>
                <Text style={styles.cardSubtitle} numberOfLines={1}>
                  {service.vehicle}
                </Text>
                <Text style={styles.cardStatus} numberOfLines={1}>
                  {service.status}
                </Text>
              </View>
            </TouchableOpacity>
          }
          onRefresh={getServices}
          refreshing={isLoading}
          ListEmptyComponent={() => <Text style={{textAlign: 'center', marginTop: 20}}>Não encontramos nenhum serviço ativo!</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </Container>
  );
}

// Seus estilos permanecem os mesmos
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    color: '#333333',
    marginLeft: 10,
  },
  logoutButton: {}, // Estilo para o botão de logout se necessário
  sectionContainer: {
    flex: 1, // Faz a seção ocupar o espaço disponível
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitleText: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '600',
    marginLeft: 8,
  },
  cardContainer: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    marginBottom: 15,
    padding: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666666',
  },
  cardStatus: {
    fontSize: 12,
    color: '#E91E63',
    fontWeight: 'bold',
  },
});
