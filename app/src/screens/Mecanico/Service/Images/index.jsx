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

  const { stepId = null } = route.params || {};

  const [images, setImages] = useState([]); // lista de { imageId, mediaId, url }
  const [imageIdToMediaIdMap, setImageIdToMediaIdMap] = useState({});
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!stepId) {
      Alert.alert('Erro', 'ID da etapa não fornecido.');
      setLoading(false);
      return;
    }

    async function fetchImages() {
      try {
        setLoading(true);

        // 1. Buscar etapas para pegar os imageIds da etapa atual
        const stepsResponse = await api.get('/steps');
        const steps = stepsResponse.data.content || [];

        const currentStep = steps.find(s => s.id === stepId);
        if (!currentStep) {
          Alert.alert('Erro', 'Etapa não encontrada.');
          setImages([]);
          setLoading(false);
          return;
        }

        // 2. Buscar mídias para montar o mapa imageId -> mediaId
        const mediaResponse = await api.get('/media?page=0&size=100');
        const medias = mediaResponse.data.content || [];

        const mapImageToMedia = {};
        medias.forEach(m => {
          mapImageToMedia[m.imageId] = m.id;
        });
        setImageIdToMediaIdMap(mapImageToMedia);

        // 3. Montar array de imagens para renderizar
        const imgs = currentStep.imageIds.map(imageId => ({
          imageId,
          mediaId: mapImageToMedia[imageId],
          url: `https://bucket-production-1ab0.up.railway.app:443/images/${imageId}`,
        }));

        setImages(imgs);
        if (imgs.length > 0) {
          setSelectedImageId(imgs[0].imageId);
        } else {
          setSelectedImageId(null);
        }

      } catch (error) {
        console.error('Erro ao buscar imagens da etapa:', error);
        Alert.alert('Erro', 'Falha ao carregar imagens.');
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, [stepId]);

  async function handleAddImage() {
    try {
      if (!stepId) {
        Alert.alert('Erro', 'ID da etapa não encontrado.');
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

      // Nova mídia criada: adicionar na lista
      const novaImagem = {
        imageId: data.imageId,
        mediaId: data.id,
        url: `https://bucket-production-1ab0.up.railway.app:443/images/${data.imageId}`,
      };

      setImages(prev => [...prev, novaImagem]);
      setSelectedImageId(data.imageId);

      // Atualizar o mapa para buscar pelo novo mediaId também
      setImageIdToMediaIdMap(prev => ({
        ...prev,
        [data.imageId]: data.id,
      }));

      Alert.alert('Sucesso', data.message || 'Imagem enviada com sucesso!');

    } catch (error) {
      console.error("ERRO AO ADICIONAR IMAGEM:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Não foi possível enviar a imagem.';
      Alert.alert('Erro', errorMessage);
    }
  }

  async function handleRemoveImage() {
    if (!selectedImageId) return;

    const mediaId = imageIdToMediaIdMap[selectedImageId];
    if (!mediaId) {
      Alert.alert('Erro', 'ID do media não encontrado para a imagem selecionada.');
      return;
    }

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
              const { data } = await api.delete(`/media/${mediaId}`);

              const novaLista = images.filter(img => img.imageId !== selectedImageId);
              setImages(novaLista);

              if (novaLista.length > 0) {
                setSelectedImageId(novaLista[0].imageId);
              } else {
                setSelectedImageId(null);
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

  const selectedImage = images.find(img => img.imageId === selectedImageId);

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
          <TouchableOpacity onPress={handleAddImage} style={{ marginTop: 15 }}>
            <Text style={{ color: colors.secondary, fontWeight: 'bold' }}>
              Adicionar a primeira imagem
            </Text>
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
              keyExtractor={item => item.imageId}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => {
                const isSelected = item.imageId === selectedImageId;
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedImageId(item.imageId)}
                    style={[styles.thumbnailWrapper, isSelected && styles.selectedThumbnail]}
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
    alignItems: 'center',
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
