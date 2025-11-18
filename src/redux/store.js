import { configureStore } from '@reduxjs/toolkit';
import sentimentsReducer from './SentimentSlice';

export const store = configureStore({
  reducer: {
    sentiments: sentimentsReducer,
  },
});
