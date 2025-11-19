import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setSentiments } from '../redux/SentimentSlice';
import { generateResponsePipeline } from '../helpers/GenerateResponsePipeline';

const IndexPage = ({ navigation }) => {
  const [dailyMessage, setDailyMessage] = useState('');
  const [dailyEntry, setDailyEntry] = useState(null);
  const [loading, setLoading] = useState(false); // <-- loading state
  const dispatch = useDispatch();
  const entries = useSelector(state => state.sentiments.entries);

  async function handleAddEntry() {
    if (!dailyMessage.trim()) return;

    try {
      setLoading(true); // <-- start loading

      const prosessedResponse = await generateResponsePipeline(dailyMessage);

      const newEntry = {
        id: Date.now(),
        message: dailyMessage,
        sentiment: prosessedResponse.sentiment,
        color: prosessedResponse.sentimentColor,
        summary: prosessedResponse.summary,
        suggestion: prosessedResponse.suggestion,
      };

      const stored = await AsyncStorage.getItem('entries');
      let existing = stored ? JSON.parse(stored) : [];

      const updatedEntries = [newEntry, ...existing];

      await AsyncStorage.setItem('entries', JSON.stringify(updatedEntries));
      dispatch(setSentiments(updatedEntries));

      setDailyEntry(newEntry);
      setDailyMessage('');
    } catch (error) {
      console.error('Sentiment error:', error);
    } finally {
      setLoading(false); // <-- stop loading
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

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={{ marginTop: 10 }}
        />
      ) : (
        <Button title="Gönder" onPress={handleAddEntry} />
      )}

      <View style={{ marginTop: 20 }}>
        <Button
          title="Haftalık Özet"
          onPress={() => navigation.navigate('WeeklySummary')}
        />
      </View>

      {dailyEntry && (
        <View style={styles.entriesContainer}>
          <View
            style={[styles.entryCard, { borderLeftColor: dailyEntry.color }]}
          >
            <Text>{dailyEntry.message}</Text>
            <Text style={{ fontWeight: 'bold' }}>{dailyEntry.sentiment}</Text>
          </View>
        </View>
      )}
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
