import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import { FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';
import { useAuth } from '../../../hooks/authHook';

import { Container } from '../../../components/Container'
import { Alert } from 'react-native';
import { api } from '../../../infra/apis/api';

// Calcula largura da tela para dimensionar cards
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.28; // cerca de 28% da largura da tela

export function Home() {

  const { logout } = useAuth();

  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useState(() => {
    getServices()
  }, [])

  async function getServices() {
    try {
      setIsLoading(true)
      const { data } = await api.get("/services", {
        params: {
          page: 0,
          limit: 9999
        }
      });

      setServices(data.content)
    } catch (error) {
      Alert.alert("Atenção", "Ocorreu um erro ao recuperar os atendimento em andamento!", "Ok");
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <FontAwesome5 name="car-side" size={32} color="#E91E63" />
          <Text style={styles.headerText}>
            Olá,{' '}
            <Text style={styles.headerTextBold}>Mecânica Boa Roda Ltda.</Text>
          </Text>
        </View>
        <TouchableOpacity style={styles.headerRight} onPress={logout} activeOpacity={0.8}>
          <Entypo name="user" size={32} color="#BBBBBB" />
          <View style={styles.avatarDot} />
        </TouchableOpacity>
      </View>

      {/* Seção de Atendimentos */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleLeft}>
            <MaterialIcons name="build-circle" size={20} color="#555555" />
            <Text style={styles.sectionTitleText}>Atendimentos em andamento</Text>
          </View>
        </View>

        {
          isLoading ?
            <ActivityIndicator /> :
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sectionScroll}
              data={services}
              renderItem={({ item: service }) =>
                <View key={service.id} style={styles.cardContainer}>
                  <View style={styles.cardInner}>
                    <FontAwesome5 name="car" size={28} color="#DDDDDD" />
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {service.title}
                    </Text>
                    <Text style={styles.cardSubtitle} numberOfLines={1}>
                      {service.vehicle}
                    </Text>
                    <Text style={styles.cardStatus} numberOfLines={1}>
                      {service.status}
                    </Text>
                  </View>
                </View>
              }
              ListEmptyComponent={() => <Text>Não encontramos nenhum serviço ativo!</Text>}
            />
        }

      </View>

      {/* Seção de Atendimentos */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleLeft}>
            <MaterialIcons name="build-circle" size={20} color="#555555" />
            <Text style={styles.sectionTitleText}>Atendimentos finalizados</Text>
          </View>
        </View>

        {
          isLoading ?
            <ActivityIndicator /> :
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sectionScroll}
              data={services}
              renderItem={({ item: service }) =>
                <View key={service.id} style={styles.cardContainer}>
                  <View style={styles.cardInner}>
                    <FontAwesome5 name="car" size={28} color="#DDDDDD" />
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {service.title}
                    </Text>
                    <Text style={styles.cardSubtitle} numberOfLines={1}>
                      {service.vehicle}
                    </Text>
                    <Text style={styles.cardStatus} numberOfLines={1}>
                      {service.status}
                    </Text>
                  </View>
                </View>
              }
              ListEmptyComponent={() => <Text>Não encontramos nenhum serviço ativo!</Text>}
            />
        }

      </View>
    </Container>
  );
}

const styles = StyleSheet.create({

  pageContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 40, // ajuste se tiver StatusBar inset ou notch
  },

  roundedButton: {
    backgroundColor: '#c6c6c6',
  },

  /***** HEADER *****/
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
  headerTextBold: {
    fontWeight: '700',
  },
  headerRight: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  avatarDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E91E63',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },

  /***** SEÇÃO (GENÉRICA) *****/
  sectionContainer: {
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
  verTudoText: {
    color: '#E91E63',
    fontWeight: '500',
  },
  sectionScroll: {
    // se quiser um paddingLeft inicial nos cards, descomente:
    // paddingLeft: 5,
  },

  /***** CARD (ATENDIMENTOS) *****/
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 0.8,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    marginRight: 15,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginTop: 8,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    textAlign: 'center',
  },
  cardStatus: {
    fontSize: 12,
    color: '#E91E63',
    marginTop: 4,
    textAlign: 'center',
  },
});
