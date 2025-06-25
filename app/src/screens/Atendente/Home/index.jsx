// ComunicaCar/app/src/screens/Atendente/Home/index.jsx

import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Container } from '../../../components/Container'
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 20;
const CARD_WIDTH = SCREEN_WIDTH - CARD_MARGIN * 2;

const dummyData = [
  {
    id: '1',
    name: 'Carlos Souza',
    vehicle: 'Renault Kwid Zen 1.0',
    description:
      'Cliente relatou ruído ao frear; identificado desgaste nas pastilhas e desalinahmento.',
    date: '20/05/2025',
    etapa: 'Em andamento',
  },
  {
    id: '2',
    name: 'Lucas Almeida',
    vehicle: 'Volkswagen Fox 1.6',
    description:
      'Cliente trouxe o carro com barulho no câmbio; trocar óleo e calibrar marchas.',
    date: '22/05/2025',
    etapa: 'Pendente',
  },
];

export function Home() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [selectedEtapa, setSelectedEtapa] = useState(dummyData[0].etapa);

  return (
    <Container>
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Atendimentos</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Search Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Nome do cliente"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Pesquisar</Text>
        </TouchableOpacity>
      </View>

      {/* Cadastrar novo veículo */}
      <TouchableOpacity style={styles.newButton}>
        <Text style={styles.newButtonText}>Cadastrar novo veículo</Text>
      </TouchableOpacity>

      {/* Cards */}
      <ScrollView contentContainerStyle={styles.cardsContainer}>
        {dummyData.map((item) => (
          <View key={item.id} style={styles.card}>
            {/* Avatar + Name */}
            <View style={styles.cardHeader}>
              <FontAwesome5 name="user-circle" size={40} color="#999" />
              <Text style={styles.cardName}>{item.name}</Text>
            </View>

            {/* Vehicle */}
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Veículo:</Text>
              <Text style={styles.cardValue}>{item.vehicle}</Text>
            </View>

            {/* Description */}
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Descrição:</Text>
              <Text style={styles.cardValue}>{item.description}</Text>
            </View>

            {/* Date */}
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Previsão:</Text>
              <View style={styles.dateInput}>
                <Text>{item.date}</Text>
                <MaterialIcons name="calendar-today" size={18} color="#999" />
              </View>
            </View>

            {/* Etapa Picker */}
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Etapa:</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={
                    item.id === dummyData[0].id ? selectedEtapa : item.etapa
                  }
                  onValueChange={(value) => setSelectedEtapa(value)}
                  style={styles.picker}
                  dropdownIconColor="#999"
                >
                  <Picker.Item label="Pendente" value="Pendente" />
                  <Picker.Item label="Em andamento" value="Em andamento" />
                  <Picker.Item label="Concluído" value="Concluído" />
                </Picker>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>Gerar QR Code</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { marginLeft: 10 }]}
              >
                <Text style={styles.actionText}>Compartilhar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E91E63',
  },

  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 4,
  },
  searchButton: {
    backgroundColor: '#E91E63',
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  newButton: {
    backgroundColor: '#E91E63',
    marginHorizontal: 16,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  newButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
    color: '#333',
  },

  cardRow: {
    flexDirection: 'row',
    alignItems: Platform.OS === 'ios' ? 'flex-start' : 'center',
    marginBottom: 12,
  },
  cardLabel: {
    width: 80,
    fontWeight: '600',
    color: '#555',
  },
  cardValue: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    padding: 8,
    color: '#333',
  },

  dateInput: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  pickerWrapper: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    width: '100%',
  },

  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
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
});
