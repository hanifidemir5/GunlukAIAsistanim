// src/redux/sentimentsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  entries: [],
  latestEntry: '',
};

const SentimentsSlice = createSlice({
  name: 'sentiments',
  initialState,
  reducers: {
    setSentiments(state, action) {
      state.entries = action.payload;
      state.latestEntry = action.payload[0];
    },
    setLatestEntry(state, action) {
      state.latestEntry = action.payload;
    },
    addSentiment(state, action) {
      state.entries.push(action.payload);
    },
    removeSentiment(state, action) {
      state.entries = state.entries.filter(e => e.id !== action.payload);
    },
    clearSentiments(state) {
      state.entries = [];
    },
  },
});

export const {
  setSentiments,
  addSentiment,
  removeSentiment,
  clearSentiments,
  setLatestEntry,
} = SentimentsSlice.actions;

export const saveToAsyncStorage = (entries, latestEntry) => async dispatch => {
  try {
    await AsyncStorage.setItem('entries', JSON.stringify(entries));
    await AsyncStorage.setItem('latestEntry', JSON.stringify(latestEntry));
    dispatch(setSentiments(entries));
  } catch (error) {
    console.error('Error saving to AsyncStorage', error);
  }
};

export const removeEntryAndUpdateLatest =
  entryId => async (dispatch, getState) => {
    dispatch(removeSentiment(entryId));

    const { entries } = getState().sentiments;

    const sorted = [...entries].sort((a, b) => b.id - a.id);

    const newLatest = sorted[0] || null;

    await AsyncStorage.setItem('entries', JSON.stringify(entries));
    await AsyncStorage.setItem('latestEntry', JSON.stringify(newLatest));
  };

export default SentimentsSlice.reducer;
