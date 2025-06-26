import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image
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
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [etapas, setEtapas] = useState([]);

  const [editandoIndex, setEditandoIndex] = useState(null);

  useEffect(() => {
    if (route.params?.Service) {
      setService(route.params?.Service);
    }
  }, [route.params]);

  useEffect(() => {
    if (service?.id && service.steps) {
      const etapasComImagens = service.steps.map((step) => ({
        ...step,
      }));

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
      serviceId: service.id
    }

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
      serviceId: service.id
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
            const etapa = etapas[index]
            await deletarEtapa(etapa)
          } catch (error) {
            Alert.alert("Atenção!", `Ocorreu um erro ao remover etapa! ${error?.message}`);
          }
        }
      }
    ]);
  }

  async function deletarEtapa(etapa) {
    await api.delete(`/steps/${etapa.id}`);

    const novasEtapas = etapas.filter(e => e.id !== etapa.id);

    // Garante que ainda haja um campo em branco para nova etapa
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

  async function handleImagemEtapa(index) {
    const etapa = etapas[index];

    if (etapa?.mediaId && etapa?.image) {
      Alert.alert(
        "Imagem existente",
        "Esta etapa já possui uma imagem. O que deseja fazer?",
        [
          {
            text: "Visualizar",
            onPress: () => visualizarImagem(etapa),
          },
          {
            text: "Modificar",
            onPress: () => modificarImagem(index),
            style: "destructive",
          },
          {
            text: "Cancelar",
            style: "cancel",
          },
        ]
      );
    } else {
      await enviarNovaImagem(index);
    }
  }

  function visualizarImagem(etapa) {
    setImagemSelecionada(etapa?.image);
  }

  async function modificarImagem(index) {
    const etapa = etapas[index];

    try {
      await api.delete(`/media/${etapa.mediaId}`);
      const novasEtapas = [...etapas];
      novasEtapas[index].mediaId = null;
      novasEtapas[index].image = null;
      setEtapas(novasEtapas);
      await enviarNovaImagem(index);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Erro ao remover imagem antiga.");
    }
  }

  async function enviarNovaImagem(index) {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Você precisa permitir o acesso à câmera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled) return;

      const novasEtapas = [...etapas];
      const etapa = novasEtapas[index];
      const imageUri = result.assets[0].uri

      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      const formData = new FormData();
      formData.append('stepId', etapa.id);
      formData.append('image', {
        uri: imageUri,
        name: `etapa-${etapa.id}.${fileType}`,
        type: `image/${fileType}`,
      });

      const { data } = await api.post('/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      etapa.image = result.assets[0].uri;
      etapa.mediaId = data?.id;

      novasEtapas[index] = etapa;
      setEtapas(novasEtapas);

      Alert.alert('Sucesso', 'Imagem enviada com sucesso!');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao enviar imagem.');
    }
  }

  if (!service) return <Container><Text>Serviço não encontrado</Text></Container>;

  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{service.title}</Text>
      </View>

      {imagemSelecionada && (
        <View style={{ margin: 16, alignItems: 'center' }}>
          <Text style={{ marginBottom: 8 }}>Visualização da imagem:</Text>
          <Image
            source={{ uri: imagemSelecionada }}
            style={{ width: '100%', height: 300, borderRadius: 8 }}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={() => setImagemSelecionada(null)} style={{ marginTop: 10 }}>
            <Text style={{ color: '#007AFF' }}>Fechar visualização</Text>
          </TouchableOpacity>
        </View>
      )}

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
                      <Feather name="edit" size={24} color="#555" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleImagemEtapa(index)}
                      style={{ marginLeft: 12 }}
                    >
                      <Feather name="camera" size={24} color="#007AFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(index)}
                      style={{ marginLeft: 12 }}
                    >
                      <Feather name="trash" size={24} color="#E91E63" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <TextInput
                style={[styles.input, !isEditing && styles.disabledInput]}
                placeholder="Título da etapa"
                value={etapa.title}
                onChangeText={(text) => {
                  const novasEtapas = [...etapas];
                  novasEtapas[index].title = text;
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
                value={etapa.description}
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
