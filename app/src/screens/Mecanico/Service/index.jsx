import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Container } from '../../../components/Container';
import { FontAwesome5, Feather } from '@expo/vector-icons';

export function Service() {
  const route = useRoute();
  const navigation = useNavigation();

  const [service, setService] = useState(null);
  const [etapas, setEtapas] = useState([
    { titulo: '', desc: '', dataCad: new Date().toISOString() }
  ]);
  const [editandoIndex, setEditandoIndex] = useState(null); // null exceto quando editando etapa antiga

  useEffect(() => {
    if (route.params?.Service) {
      setService(route.params.Service);
    }
  }, [route.params]);

  function handleSave() {
    const index = editandoIndex !== null ? editandoIndex : etapas.length - 1;
    const etapa = etapas[index];

    if (!etapa.titulo.trim() || !etapa.desc.trim()) return;

    const novaEtapas = [...etapas];
    novaEtapas[index].dataCad = new Date().toISOString();

    // Se estiver editando uma etapa antiga
    if (editandoIndex !== null && editandoIndex !== etapas.length - 1) {
      setEtapas(novaEtapas);
      setEditandoIndex(null);
      return;
    }

    // Se for nova etapa
    novaEtapas.push({
      titulo: '',
      desc: '',
      dataCad: new Date().toISOString(),
    });

    setEtapas(novaEtapas);
    setEditandoIndex(null);
  }

  function handleDelete(index) {
    Alert.alert('Remover etapa', 'Deseja realmente remover esta etapa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          const novaEtapas = etapas.filter((_, i) => i !== index);
          setEtapas(novaEtapas);
          if (editandoIndex === index) {
            setEditandoIndex(null);
          }
        }
      }
    ]);
  }

  function handleEdit(index) {
    setEditandoIndex(index);
  }

  if (!service) return <Text>Serviço não encontrado</Text>;

  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{service.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.label}>Veículo:</Text>
          <Text style={styles.value}>{service.vehicle}</Text>

          <Text style={styles.label}>Descrição:</Text>
          <Text style={styles.value}>{service.description}</Text>
        </View>

        {etapas.map((etapa, index) => {
          const isUltima = index === etapas.length - 1;
          const isEditing =
            (editandoIndex !== null && index === editandoIndex) ||
            (editandoIndex === null && isUltima);

          return (
            <View style={styles.card} key={index}>
              <View style={styles.etapaHeader}>
                <Text style={styles.sectionTitle}>Etapa {index + 1}</Text>
                {!isUltima && (
                  <View style={styles.icons}>
                    <TouchableOpacity onPress={() => handleEdit(index)}>
                      <Feather name="edit" size={20} color="#555" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(index)}
                      style={{ marginLeft: 12 }}
                    >
                      <Feather name="trash" size={20} color="#E91E63" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <TextInput
                style={[styles.input, !isEditing && styles.disabledInput]}
                placeholder="Título da etapa"
                value={etapa.titulo}
                onChangeText={(text) => {
                  const novasEtapas = [...etapas];
                  novasEtapas[index].titulo = text;
                  setEtapas(novasEtapas);
                }}
                editable={isEditing}
              />
              <TextInput
                style={[
                  styles.input,
                  { height: 80 },
                  !isEditing && styles.disabledInput,
                ]}
                placeholder="Descrição da etapa"
                multiline
                value={etapa.desc}
                onChangeText={(text) => {
                  const novasEtapas = [...etapas];
                  novasEtapas[index].desc = text;
                  setEtapas(novasEtapas);
                }}
                editable={isEditing}
              />
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {editandoIndex !== null && editandoIndex !== etapas.length - 1
            ? `Editar etapa ${editandoIndex + 1}`
            : 'Salvar etapa'}
        </Text>
      </TouchableOpacity>
    </Container>
  );
}

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
  button: {
    backgroundColor: '#E91E63',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 32,
    marginHorizontal: 16,
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
