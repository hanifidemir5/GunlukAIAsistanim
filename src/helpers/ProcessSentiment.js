import axios from 'axios';
import Config from 'react-native-config';

export async function processSentiment(text) {
  const prompt = `
    Destekleyici bir arkadaşsın. 
    Aşağıdaki metni oku ve iki şey üret:

    1. Özet: 1-2 kısa, empatik özetleyici cümle; teşvik edici ve samimi olsun.
    2. Öneri: 1-2 kısa, empatik öneri içeren cümle; yardımcı ve yol gösterici olsun.

    Yanıtı yalnızca JSON formatında ve yalnızca şu iki anahtar ile döndür:
    "summary" ve "suggestion".

    Açıklama, alıntı, yorum veya ekstra metin ekleme. 
    Cümleleri Türkçe yaz.

    Metin: "${text}"`;

  const response = await axios.post(
    'https://router.huggingface.co/v1/chat/completions',
    {
      model: 'deepseek-ai/DeepSeek-R1:novita',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${Config.HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
    },
  );

  const message = response.data.choices?.[0]?.message?.content || '';
  return message;
}
