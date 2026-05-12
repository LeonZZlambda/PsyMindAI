export interface SRSItem {
  itemId: string;
  easeFactor: number;        // default 2.5
  interval: number;          // em dias
  nextReview: Date;
  reviewHistory: Array<{
    date: Date;
    quality: number;         // 0-5
    theta?: number;          // proficiência estimada
  }>;
  examType: 'ENEM' | 'A-Levels' | 'IB' | 'Abitur' | string;
}

export const calculateNextReview = (item: SRSItem, quality: number): SRSItem => {
  let { easeFactor, interval } = item;

  // Ajuste SM-2 clássico
  if (quality >= 3) {
    if (interval === 1) interval = 6;
    else if (interval === 6) interval = Math.round(interval * easeFactor);
    else interval = Math.round(interval * easeFactor);
  } else {
    interval = 1; // reset
  }

  // Ajuste do Ease Factor
  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  // Forgetting curve (simplificada Ebbinghaus)
  const forgettingProb = Math.exp(-interval / (easeFactor * 5));
  const adjustedInterval = Math.ceil(interval * (1 - forgettingProb * 0.3));

  return {
    ...item,
    easeFactor: Number(easeFactor.toFixed(2)),
    interval: adjustedInterval,
    nextReview: new Date(Date.now() + adjustedInterval * 86400000),
    reviewHistory: [...item.reviewHistory, { date: new Date(), quality, theta: item.reviewHistory.at(-1)?.theta }]
  };
};