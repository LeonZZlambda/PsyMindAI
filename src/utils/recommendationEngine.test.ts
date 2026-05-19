// Test script for the recommendation engine
import { describe, expect, it } from 'vitest';
import { recommendationEngine, TopicProficiency, QuestionMetadata, IRTModel } from './recommendationEngine.ts';
import { SRSItem } from './srsAlgorithm.ts';

// Mock data for testing
const mockProficiencies: Record<string, TopicProficiency> = {
  'Mathematics': {
    topicId: 'Mathematics',
    theta: 0.5, // Moderately proficient
    lastReviewed: new Date(Date.now() - 86400000), // 1 day ago
    reviewCount: 10,
    correctCount: 7,
    difficultyHistory: [2, 3, 2, 4, 3]
  },
  'Physics': {
    topicId: 'Physics',
    theta: -0.3, // Needs improvement
    lastReviewed: new Date(Date.now() - 172800000), // 2 days ago
    reviewCount: 8,
    correctCount: 4,
    difficultyHistory: [3, 4, 3, 2]
  }
};

const mockSRSData: Record<string, SRSItem> = {
  'math_q1': {
    itemId: 'math_q1',
    easeFactor: 2.3,
    interval: 3,
    nextReview: new Date(Date.now() - 3600000), // Due 1 hour ago
    reviewHistory: [
      { date: new Date(Date.now() - 86400000 * 2), quality: 4, theta: 0.3 }
    ],
    examType: 'ENEM'
  },
  'physics_q1': {
    itemId: 'physics_q1',
    easeFactor: 2.1,
    interval: 1,
    nextReview: new Date(Date.now() + 86400000), // Due tomorrow
    reviewHistory: [
      { date: new Date(Date.now() - 86400000), quality: 3, theta: -0.2 }
    ],
    examType: 'ENEM'
  }
};

const mockQuestions: QuestionMetadata[] = [
  {
    id: 'math_q1',
    topic: 'Mathematics',
    difficulty: 3,
    examType: 'ENEM',
    tags: ['algebra', 'equations'],
    irtParams: {
      id: 'math_q1',
      difficulty: 0.2, // Slightly above average difficulty
      discrimination: 1.0,
      guessing: 0.1,
      topic: 'Mathematics',
      examType: 'ENEM',
      tags: ['algebra', 'equations']
    }
  },
  {
    id: 'math_q2',
    topic: 'Mathematics',
    difficulty: 2,
    examType: 'ENEM',
    tags: ['geometry', 'triangles'],
    irtParams: {
      id: 'math_q2',
      difficulty: -0.3, // Below average difficulty
      discrimination: 0.9,
      guessing: 0.15,
      topic: 'Mathematics',
      examType: 'ENEM',
      tags: ['geometry', 'triangles']
    }
  },
  {
    id: 'physics_q1',
    topic: 'Physics',
    difficulty: 4,
    examType: 'ENEM',
    tags: ['mechanics', 'forces'],
    irtParams: {
      id: 'physics_q1',
      difficulty: 0.8, // High difficulty
      discrimination: 1.1,
      guessing: 0.05,
      topic: 'Physics',
      examType: 'ENEM',
      tags: ['mechanics', 'forces']
    }
  },
  {
    id: 'physics_q2',
    topic: 'Physics',
    difficulty: 3,
    examType: 'ENEM',
    tags: ['thermodynamics', 'heat'],
    irtParams: {
      id: 'physics_q2',
      difficulty: 0.1, // Average difficulty
      discrimination: 0.95,
      guessing: 0.12,
      topic: 'Physics',
      examType: 'ENEM',
      tags: ['thermodynamics', 'heat']
    }
  },
  {
    id: 'chemistry_q1',
    topic: 'Chemistry',
    difficulty: 3,
    examType: 'ENEM',
    tags: ['organic', 'reactions'],
    irtParams: {
      id: 'chemistry_q1',
      difficulty: 0.0, // Average difficulty
      discrimination: 0.85,
      guessing: 0.08,
      topic: 'Chemistry',
      examType: 'ENEM',
      tags: ['organic', 'reactions']
    }
  }
];

describe('Recommendation Engine', () => {
  it('should get recommendations correctly', () => {
    const recommendations = recommendationEngine.getRecommendations(
      mockProficiencies,
      mockSRSData,
      mockQuestions,
      [], // No session history
      3
    );

    expect(recommendations).toBeDefined();
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations.length).toBeLessThanOrEqual(3);
  });

  it('should compute IRT probability correct', () => {
    mockQuestions.forEach(q => {
      const proficiency = mockProficiencies[q.topic];
      if (q.irtParams && proficiency) {
        const prob = IRTModel.probabilityCorrect(proficiency.theta, q.irtParams);
        expect(prob).toBeGreaterThanOrEqual(0);
        expect(prob).toBeLessThanOrEqual(1);
      }
    });
  });

  it('should estimate ability from responses', () => {
    const responses = [1, 0, 1, 1, 0]; // Correct, wrong, correct, correct, wrong
    const questionIRTParams = mockQuestions.slice(0, 5).map(q => q.irtParams!).filter(p => p);
    const irtResponses = responses.map((correct, i) => ({
      item: questionIRTParams[i],
      correct: correct === 1
    }));
    const estimatedAbility = IRTModel.estimateAbilityEAP(irtResponses);
    expect(estimatedAbility.theta).toBeDefined();
    expect(estimatedAbility.se).toBeGreaterThanOrEqual(0);
  });
});