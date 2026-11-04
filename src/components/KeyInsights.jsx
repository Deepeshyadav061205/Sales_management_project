// Auto-generated Key Insights card shown when at least 10 orders match the active filters.

import { generateKeyInsights } from '../utils/calculations.js';

export default function KeyInsights({ orders }) {
  const insights = generateKeyInsights(orders);
  if (!insights) {
    return null;
  }

  return (
    <div className="card">
      <h2 className="card-title">Key Insights</h2>
      <ul className="insights-list">
        {insights.sentences.map((sentence, idx) => (
          <li key={idx}>{sentence}</li>
        ))}
      </ul>
      <p className="insight-recommendation">
        <strong>Recommendation:</strong> {insights.recommendation}
      </p>
    </div>
  );
}
