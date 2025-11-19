import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setSentiments } from '../redux/SentimentSlice';
import { generateResponsePipeline } from '../helpers/GenerateResponsePipeline';
import {
  TextInput as PaperInput,
  Button as PaperButton,
  Card,
  Title,
  Paragraph,
  ActivityIndicator as PaperActivityIndicator,
} from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import { fetchWithTimeout } from '../helpers/FetchWithTimeOut';

const IndexPage = ({ navigation }) => {
  const [dailyMessage, setDailyMessage] = useState('');
  const [dailyEntry, setDailyEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const entries = useSelector(state => state.sentiments.entries);
  const latestEntry = useSelector(state => state.sentiments.latestEntry);

  async function handleAddEntry() {
    if (!dailyMessage.trim()) {
      Alert.alert('Alan boş bırakılamaz', 'Lütfen tekrar deneyiniz.');
      return;
    }

    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      Alert.alert(
        'Bağlantı Yok',
        'İnternet bağlantısı yok. Daha sonra tekrar deneyiniz.',
      );
      return;
    }

    try {
      setLoading(true);

      const prosessedResponse = await fetchWithTimeout(
        () => generateResponsePipeline(dailyMessage),
        60000,
      );

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
      if (error.message === 'timeout') {
        Alert.alert(
          'Zaman Aşımı',
          'İstek çok uzun sürdü. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.',
        );
      } else {
        console.log(error);
        Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        dailyEntry?.color ? { backgroundColor: latestEntry.color } : {},
      ]}
    >
      <Text style={styles.title}>AI Günlük Asistanım</Text>
      <View style={styles.weaklySummaryButtonContainer}>
        <PaperButton
          mode="contained"
          buttonColor="#FFC107"
          textColor="#000"
          onPress={() => navigation.navigate('WeeklySummary')}
        >
          Haftalık Özet
        </PaperButton>
      </View>
      <PaperInput
        label="Bugün nasıl hissediyorsun?"
        value={dailyMessage}
        onChangeText={setDailyMessage}
        style={{
          marginBottom: 10,
        }}
      />

      {loading ? (
        <PaperActivityIndicator
          animating={true}
          size="large"
          color="#007AFF"
          style={{ marginTop: 10 }}
        />
      ) : (
        <PaperButton
          mode="contained"
          buttonColor="#007AFF"
          onPress={handleAddEntry}
        >
          Gönder
        </PaperButton>
      )}

      {dailyEntry && (
        <View style={styles.entriesContainer}>
          <Card
            style={{
              marginBottom: 10,
              borderLeftWidth: 6,
              borderLeftColor: dailyEntry.color,
            }}
          >
            <Card.Content>
              <Title>Özet</Title>
              <Paragraph>{dailyEntry.summary}</Paragraph>
              <Title>Öneri</Title>
              <Paragraph>{dailyEntry.suggestion}</Paragraph>
              <Title style={{ color: dailyEntry.color }}>
                {dailyEntry.sentiment}
              </Title>
            </Card.Content>
          </Card>
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
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'start',
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
  weaklySummaryButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
});

export default IndexPage;
