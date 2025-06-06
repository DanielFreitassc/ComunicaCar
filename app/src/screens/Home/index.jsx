import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useAuth } from '../../hooks/authHook';
import { getServices } from '../../sevices/serviceApi';

export function Home() {
  const { logout } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices(0, 10)
      .then((data) => {
        setServices(data.content);
      })
      .catch((error) => {
        console.error('Erro ao buscar serviços:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Serviços</Text>

      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.serviceCard}>
              <Text style={styles.serviceTitle}>{item.title}</Text>
              <Text>Veículo: {item.vehicle}</Text>
              <Text>Status: {item.status}</Text>
            </View>
          )}
        />
      )}

      <Button title="Logout" onPress={logout} color="#e53935" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  serviceCard: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
