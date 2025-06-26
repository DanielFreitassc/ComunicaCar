import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { api } from '../../../infra/apis/api';
import colors from '../../../globals/theme/colors';

const ServiceCard = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTicket}>#{item.ticketNumber}</Text>
      <Text style={styles.cardDate}>{item.conclusionDate}</Text>
    </View>
    <Text style={styles.cardTitle}>{item.title}</Text>
    <Text style={styles.cardVehicle}>{item.vehicle}</Text>
    <Text style={styles.cardDescription}>{item.description}</Text>
  </View>
);

export default function FinishJobs() {
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const PAGE_SIZE = 10;

  const fetchServices = useCallback(
    async (reset = false) => {
      if (loading || (!hasMore && !reset)) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get('/services', {
          params: {
            status: 'ready',
            page: reset ? 0 : page,
            size: PAGE_SIZE,
          },
        });

        const { content, last } = response.data;

        setServices(prev => {
          const all = reset ? content : [...prev, ...content];
          const unique = [...new Map(all.map(item => [item.id, item])).values()];
          return unique;
        });

        setPage(prev => (reset ? 1 : prev + 1));
        setHasMore(!last);
      } catch (err) {
        console.error('Erro ao buscar serviços:', err);
        setError('Erro ao carregar serviços. Tente novamente.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, loading, hasMore]
  );

  useEffect(() => {
    fetchServices(true);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    fetchServices(true);
  };

  const renderFooter = () =>
    loading && !refreshing ? (
      <ActivityIndicator style={{ marginVertical: 20 }} size="large" color={colors.primary} />
    ) : null;

  const renderEmptyList = () =>
    !loading && (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{error || 'Nenhum serviço concluído encontrado.'}</Text>
        {error && (
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchServices(true)}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        )}
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={services}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ServiceCard item={item} />}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Text style={styles.headerTitle}>Serviços Concluídos</Text>}
        onEndReached={() => {
          if (!loading && hasMore) fetchServices();
        }}
        onEndReachedThreshold={0.4}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    paddingTop: 8
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginBottom: 16
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardTicket: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
  },
  cardDate: {
    fontSize: 12,
    color: colors.grayDark,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.grayDark,
    marginVertical: 4,
  },
  cardVehicle: {
    fontSize: 15,
    fontStyle: 'italic',
    color: colors.grayLight,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 15,
    color: colors.grayDark,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.grayDark,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
