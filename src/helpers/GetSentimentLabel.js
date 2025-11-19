export function getSentimentLabel(result) {
  // result is expected like: [[{label, score}, ...]]
  const predictions = result[0];

  // Find the highest score
  const best = predictions.reduce((prev, curr) =>
    curr.score > prev.score ? curr : prev,
  );
  // Convert label to a consistent text
  switch (best.label) {
    case 'Positive':
      return { sentiment: 'Pozitif', sentimentColor: '#2effb6' };
    case 'Very Positive':
      return { sentiment: 'Çok Pozitif', sentimentColor: 'green' };
    case 'Very Negative':
      return { sentiment: 'Çok Negatif', sentimentColor: '#91010fff' };
    case 'Negative':
      return { sentiment: 'Negatif', sentimentColor: '#ff0019' };
    case 'Neutral':
    default:
      return { sentiment: 'Nötr', sentimentColor: 'gray' };
  }
}
