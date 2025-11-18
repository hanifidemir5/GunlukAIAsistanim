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
      return { sentiment: 'Positive', color: '#2effb6' };
    case 'Very Positive':
      return { sentiment: 'Very Positive', color: 'green' };
    case 'Very Negative':
      return { sentiment: 'Very Negative', color: '#91010fff' };
    case 'Negative':
      return { sentiment: 'Negative', color: '#ff0019' };
    case 'Neutral':
    default:
      return { sentiment: 'Neutral', color: 'gray' };
  }
}
