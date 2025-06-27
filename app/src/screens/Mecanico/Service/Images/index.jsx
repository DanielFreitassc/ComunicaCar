import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import colors from '../../../../globals/theme/colors';
import * as ImagePicker from 'expo-image-picker';
import { Container } from '../../../../components/Container';
import { api } from '../../../../infra/apis/api';

export function Images() {
  const route = useRoute();
  const navigation = useNavigation();

  const { imageIds = [], initialImageId = null, stepId = null } = route.params || {};

  const [images, setImages] = useState([]);
  const [selectedId, setSelectedId] = useState(initialImageId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (imageIds.length === 0) {
      setLoading(false);
      return;
    }

    async function fetchImageUrls() {
      try {
        setLoading(true);

        const urls = imageIds.map(id => ({
          id,
          url: `https://bucket-production-1ab0.up.railway.app:443/images/${id}`
        }));

        setImages(urls);

        if (!initialImageId && urls.length > 0) {
          setSelectedId(urls[0].id);
        } else {
          setSelectedId(initialImageId);
        }
      } catch (error) {
        console.error('Erro ao montar URLs de imagem:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchImageUrls();
  }, [imageIds, initialImageId]);

  async function handleAddImage() {
    try {
      if (!stepId) {
        Alert.alert('ID da etapa não encontrado.');
        return;
      }

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

      const imageUri = result.assets[0].uri;
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      const formData = new FormData();
      formData.append('stepId', stepId);
      formData.append('image', {
        uri: imageUri,
        name: `etapa-${stepId}.${fileType}`,
        type: `image/${fileType}`,
      });

      const { data } = await api.post('/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const novaImagem = {
        id: data?.id,
        url: `https://bucket-production-1ab0.up.railway.app:443/images/${data?.id}`,
      };

      setImages((prev) => [...prev, novaImagem]);
      setSelectedId(data?.id);
      
      // ==========================================================
      // CORREÇÃO: Exibindo a mensagem de sucesso da API
      // ==========================================================
      Alert.alert('Sucesso', data?.message || 'Imagem enviada com sucesso!');

    } catch (error) {
      // Logando a resposta completa do erro para facilitar a depuração
      console.error("ERRO AO ADICIONAR IMAGEM:", error.response?.data || error.message);
      
      // ==========================================================
      // CORREÇÃO: Exibindo a mensagem de erro da API
      // ==========================================================
      const errorMessage = error.response?.data?.message || 'Não foi possível enviar a imagem.';
      Alert.alert('Erro', errorMessage);
    }
  }

  async function handleRemoveImage() {
    if (!selectedId) return;

    Alert.alert(
      'Remover imagem',
      'Tem certeza que deseja remover esta imagem?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              const { data } = await api.delete(`/media/${selectedId}`);

              const novaLista = images.filter(img => img.id !== selectedId);
              setImages(novaLista);

              if (novaLista.length > 0) {
                setSelectedId(novaLista[0].id);
              } else {
                setSelectedId(null);
              }
              
              Alert.alert('Sucesso', data?.message || 'Imagem removida com sucesso!');

            } catch (error) {
              console.error("ERRO AO REMOVER IMAGEM:", error.response?.data || error.message);
              
              const errorMessage = error.response?.data?.message || 'Não foi possível remover a imagem.';
              Alert.alert('Erro', errorMessage);
            }
          },
        },
      ]
    );
  }

  const selectedImage = images.find(img => img.id === selectedId);

  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={22} color="#333" />
        </TouchableOpacity>

        <Text style={styles.title}>Imagens</Text>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={handleAddImage}>
            <Feather name="plus-circle" size={24} color={colors.secondary} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRemoveImage}>
            <Feather name="trash-2" size={24} color={colors.error || '#E53935'} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.secondary} style={{ flex: 1 }} />
      ) : images.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma imagem disponível.</Text>
          <TouchableOpacity onPress={handleAddImage} style={{marginTop: 15}}>
              <Text style={{color: colors.secondary, fontWeight: 'bold'}}>Adicionar a primeira imagem</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage.url }}
              style={styles.mainImage}
              resizeMode="contain"
            />
          )}

          <View style={styles.thumbnailBar}>
            <FlatList
              data={images}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => {
                const isSelected = item.id === selectedId;
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedId(item.id)}
                    style={[
                      styles.thumbnailWrapper,
                      isSelected && styles.selectedThumbnail,
                    ]}
                  >
                    <Image
                      source={{ uri: item.url }}
                      style={styles.thumbnail}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  mainImage: {
    flex: 1,
    width: '100%',
    backgroundColor: '#EEE',
  },
  thumbnailBar: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#EEE',
    backgroundColor: '#FFF',
  },
  listContainer: {
    paddingHorizontal: 8,
    alignItems: 'center'
  },
  thumbnailWrapper: {
    marginHorizontal: 6,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: colors.secondary,
  },
  thumbnail: {
    width: 80,
    height: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});