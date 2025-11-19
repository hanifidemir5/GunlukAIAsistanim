import { processSentiment } from './ProcessSentiment';
import { extractSummaryAndSuggestion } from './ExtractSummaryAndSuggestion';
import { getSentimentLabel } from './GetSentimentLabel';
import { analyzeSentiment } from './AnalyzeText';

export async function generateResponsePipeline(dailySentiment) {
  try {
    const rawAnalyzeResponse = await analyzeSentiment(dailySentiment);
    const { sentiment, sentimentColor } = getSentimentLabel(rawAnalyzeResponse);

    const rawResponse = await processSentiment(dailySentiment);
    const { summary, suggestion } = extractSummaryAndSuggestion(rawResponse);
    return {
      sentiment: sentiment,
      sentimentColor: sentimentColor,
      originalText: dailySentiment,
      summary: summary,
      suggestion: suggestion,
    };
  } catch (err) {
    console.log('Pipeline error:', err);
    return null;
  }
}
