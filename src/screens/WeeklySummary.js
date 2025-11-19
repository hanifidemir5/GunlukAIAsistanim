// src/screens/WeeklySummary.js
import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import {
  removeSentiment,
  setLatestEntry,
  clearSentiments,
} from '../redux/SentimentSlice';

const WeeklySummary = () => {
  const [entries, setEntries] = useState([]);
  const [latestEntry, setLocalLatestEntry] = useState(null);
  const dispatch = useDispatch();

  const loadEntriesFromStorage = async () => {
    const storedEntries = await AsyncStorage.getItem('entries');
    if (storedEntries) {
      const parsed = JSON.parse(storedEntries);
      parsed.sort((a, b) => b.id - a.id);
      setEntries(parsed);

      // Update latestEntry
      const storedLatestEntry = await AsyncStorage.getItem('latestEntry');
      setLocalLatestEntry(
        storedLatestEntry ? JSON.parse(storedLatestEntry) : null,
      );
    }
  };

  useEffect(() => {
    loadEntriesFromStorage();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEntriesFromStorage();
    }, []),
  );

  const handleClearDailyEntry = async id => {
    try {
      const stored = await AsyncStorage.getItem('entries');
      const existingEntries = stored ? JSON.parse(stored) : [];

      const updatedEntries = existingEntries.filter(entry => entry.id !== id);

      await AsyncStorage.setItem('entries', JSON.stringify(updatedEntries));
      dispatch(removeSentiment(id));

      // Update latestEntry
      const newLatestEntry =
        updatedEntries.length > 0 ? updatedEntries[0] : null;
      if (newLatestEntry) {
        await AsyncStorage.setItem(
          'latestEntry',
          JSON.stringify(newLatestEntry),
        );
      } else {
        await AsyncStorage.removeItem('latestEntry');
      }

      dispatch(setLatestEntry(newLatestEntry));
      setLocalLatestEntry(newLatestEntry);
      setEntries(updatedEntries);
    } catch (error) {
      console.error('Error removing entry', error);
      Alert.alert('Hata', 'Günlük silinirken bir hata oluştu.');
    }
  };

  const handleClearAllEntries = async () => {
    try {
      await AsyncStorage.removeItem('entries');
      await AsyncStorage.removeItem('latestEntry');
      dispatch(clearSentiments());
      setEntries([]);
      setLocalLatestEntry(null);
    } catch (error) {
      console.error('Error clearing entries', error);
      Alert.alert('Hata', 'Tüm geçmiş silinirken bir hata oluştu.');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: latestEntry?.color || '#f5f5f5' },
      ]}
    >
      <Text style={styles.title}>Haftalık Özet</Text>

      {entries.length === 0 && (
        <Text style={styles.emptyText}>Henüz bir giriş yok.</Text>
      )}

      {entries.map(entry => (
        <View
          key={entry.id}
          style={[styles.entryCard, { borderLeftColor: entry.color }]}
        >
          <Text style={{ fontWeight: 'bold' }}>
            {new Date(entry.id).toLocaleString('tr-TR')}
          </Text>
          <Text style={styles.cardTitle}>
            Günlük mesaj:{' '}
            <Text style={styles.messageText}>{entry.message}</Text>
          </Text>
          <Text style={styles.cardTitle}>
            Özet: <Text style={styles.messageText}>{entry.summary}</Text>
          </Text>
          <Text style={styles.cardTitle}>
            Öneri: <Text style={styles.messageText}>{entry.suggestion}</Text>
          </Text>
          <Text style={[styles.sentimentText, { color: entry.color }]}>
            {entry.sentiment}
          </Text>
          <Button
            title="Günlüğü Temizle"
            onPress={() => handleClearDailyEntry(entry.id)}
            color="red"
          />
        </View>
      ))}

      {entries.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Button
            title="Tüm Geçmişi Temizle"
            onPress={handleClearAllEntries}
            color="red"
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'start',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  entryCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontWeight: 'normal',
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 8,
  },
  sentimentText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default WeeklySummary;
