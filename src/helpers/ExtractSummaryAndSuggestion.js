export function extractSummaryAndSuggestion(responseText) {
  let summary = '';
  let suggestion = '';

  try {
    // extract JSON portion from text
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      summary = parsed.summary;
      suggestion = parsed.suggestion;
    }
  } catch (error) {
    console.error('Failed to parse JSON:', error);
  }

  return { summary, suggestion };
}
