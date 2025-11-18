import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { analyzeSentiment } from '../helpers/AnalyzeText';
import { getSentimentLabel } from '../helpers/GetSentimentLabel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import {
  entries,
  addSentiment,
  setSentiments,
  saveToAsyncStorage,
} from '../redux/SentimentSlice';

const IndexPage = ({ navigation }) => {
  // <-- receive navigation prop
  const [dailyMessage, setDailyMessage] = useState('');
  const dispatch = useDispatch();
  const entries = useSelector(state => state.sentiments.entries);

  // Load saved entries
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const stored = await AsyncStorage.getItem('entries');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.sort((a, b) => b.id - a.id);
          dispatch(setSentiments(parsed));
        }
      } catch (error) {
        console.error('Error loading entries', error);
      }
    };
    loadEntries();
  }, []);

  async function handleAddEntry() {
    if (!dailyMessage.trim()) return;

    try {
      const apiResponse = await analyzeSentiment(dailyMessage);
      const { sentiment, color } = getSentimentLabel(apiResponse);

      const newEntry = {
        id: Date.now(),
        message: dailyMessage,
        sentiment,
        color,
      };

      // Build updated array
      const updatedEntries = [...entries, newEntry];

      // Update Redux state
      dispatch(setSentiments(updatedEntries));

      // Persist to AsyncStorage
      await AsyncStorage.setItem('entries', JSON.stringify(updatedEntries));

      setDailyMessage('');
    } catch (error) {
      console.error('Sentiment error:', error);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Günlük Asistanım</Text>
      <TextInput
        style={styles.input}
        placeholder="Bugün nasıl hissediyorsun?"
        value={dailyMessage}
        onChangeText={setDailyMessage}
      />
      <Button title="Gönder" onPress={handleAddEntry} />

      <View style={{ marginTop: 20 }}>
        <Button
          title="Haftalık Özet"
          onPress={() => navigation.navigate('WeeklySummary')} // <-- navigate
        />
      </View>

      <View style={styles.entriesContainer}>
        {entries.map(entry => (
          <View
            key={entry.id}
            style={[styles.entryCard, { borderLeftColor: entry.color }]}
          >
            <Text>{entry.message}</Text>
            <Text style={{ color: entry.color, fontWeight: 'bold' }}>
              {entry.sentiment}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  entriesContainer: { marginTop: 20 },
  entryCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 6,
  },
});

export default IndexPage;
