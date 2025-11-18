// src/screens/WeeklySummary.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WeeklySummary = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const stored = await AsyncStorage.getItem('entries');
        if (stored) {
          const parsed = JSON.parse(stored); // <-- parse first
          parsed.sort((a, b) => b.id - a.id); // <-- then sort
          setEntries(parsed);
        }
      } catch (error) {
        console.error('Error loading entries', error);
      }
    };

    loadEntries();
  }, []);

  const clearEntries = async () => {
    try {
      await AsyncStorage.removeItem('entries');
      setEntries([]);
    } catch (error) {
      console.error('Error clearing entries', error);
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
          <Text style={styles.messageText}>{entry.message}</Text>
          <Text style={[styles.sentimentText, { color: entry.color }]}>
            {entry.sentiment.toUpperCase()}
          </Text>
        </View>
      ))}

      {entries.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Button
            title="Tüm Geçmişi Temizle"
            onPress={clearEntries}
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
    fontSize: 16,
    marginBottom: 5,
  },
  sentimentText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default WeeklySummary;
