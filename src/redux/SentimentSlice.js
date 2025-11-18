// src/redux/sentimentsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  entries: [],
};

const SentimentsSlice = createSlice({
  name: 'sentiments',
  initialState,
  reducers: {
    setSentiments(state, action) {
      state.entries = action.payload;
    },
    addSentiment(state, action) {
      state.entries.push(action.payload);
    },
    removeSentiment(state, action) {
      // action.payload = id of the entry to remove
      state.entries = state.entries.filter(e => e.id !== action.payload);
    },
    clearSentiments(state) {
      state.entries = [];
    },
  },
});

export const { setSentiments, addSentiment, removeSentiment, clearSentiments } =
  SentimentsSlice.actions;

export const saveToAsyncStorage = entries => async dispatch => {
  try {
    await AsyncStorage.setItem('entries', JSON.stringify(entries));
    dispatch(setSentiments(entries));
  } catch (error) {
    console.error('Error saving to AsyncStorage', error);
  }
};

export default SentimentsSlice.reducer;
