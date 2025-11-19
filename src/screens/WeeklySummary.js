// src/screens/WeeklySummary.js
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { removeSentiment } from '../redux/SentimentSlice';

const WeeklySummary = () => {
  const [entries, setEntries] = useState([]);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      const loadEntries = async () => {
        const stored = await AsyncStorage.getItem('entries');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.sort((a, b) => b.id - a.id);
          setEntries(parsed);
        }
      };

      loadEntries();
    }, []),
  );

  const handleClearEntries = async () => {
    try {
      await AsyncStorage.removeItem('entries');
      dispatch(clearSentiments());
      setEntries([]); // clear local state too
    } catch (error) {
      console.error('Error clearing entries', error);
    }
  };

  const handleClearDailyEntry = async id => {
    try {
      const stored = await AsyncStorage.getItem('entries');
      const existingEntries = stored ? JSON.parse(stored) : [];

      const updatedEntries = existingEntries.filter(entry => entry.id !== id);

      await AsyncStorage.setItem('entries', JSON.stringify(updatedEntries));

      dispatch(removeSentiment(id));

      setEntries(updatedEntries);
    } catch (error) {
      console.error('Error removing entry', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Haftalık Özet</Text>

      {entries.length === 0 && (
        <Text style={styles.emptyText}>Henüz bir giriş yok.</Text>
      )}

      {entries.map(entry => (
        <View
          key={entry.id}
          style={[styles.entryCard, { borderLeftColor: entry.color }]}
        >
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
          ></Button>
        </View>
      ))}

      {entries.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Button
            title="Tüm Geçmişi Temizle"
            onPress={handleClearEntries}
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
