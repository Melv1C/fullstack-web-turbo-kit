import { useAPIHealth } from '@/hooks/use-api-health';
import { env } from '@/lib/env';
import { APP_NAME } from '@repo/utils';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const healthQuery = useAPIHealth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{APP_NAME}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>API Health Check</Text>
        {healthQuery.isLoading && <ActivityIndicator size="small" />}
        {healthQuery.isError && (
          <Text style={styles.error}>Error: {healthQuery.error.message}</Text>
        )}
        {healthQuery.isSuccess && (
          <Text style={styles.success}>{JSON.stringify(healthQuery.data, null, 2)}</Text>
        )}
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Environment</Text>
        <Text style={styles.label}>NODE_ENV: {env.EXPO_PUBLIC_NODE_ENV}</Text>
        <Text style={styles.label}>BACKEND_URL: {env.EXPO_PUBLIC_BACKEND_URL}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
  success: {
    fontSize: 13,
    color: '#16a34a',
    fontFamily: 'monospace',
  },
  error: {
    fontSize: 13,
    color: '#dc2626',
  },
});
