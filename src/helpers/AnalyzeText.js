import axios from 'axios';
import Config from 'react-native-config';

const HF_API_URL =
  'https://router.huggingface.co/hf-inference/models/tabularisai/multilingual-sentiment-analysis';

export const analyzeSentiment = async userText => {
  try {
    const response = await axios.post(
      HF_API_URL,
      { inputs: userText },
      {
        headers: {
          Authorization: `Bearer ${Config.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('HF API ERROR:', error?.response?.data || error.message);
    throw error;
  }
};
