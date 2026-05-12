import { SRSItem } from './srsAlgorithm.ts';

// IRT Item Parameters (3PL Model)
export interface IRTItemParameters {
  id: string;
  difficulty: number; // b parameter (location)
  discrimination: number; // a parameter (slope)
  guessing: number; // c parameter (lower asymptote)
  topic: string;
  examType: string;
  tags: string[];
}

// IRT Ability Estimation
export interface IRTAbility {
  theta: number; // Estimated ability
  se: number; // Standard error
  lastUpdated: Date;
  responseHistory: Array<{
    itemId: string;
    response: boolean; // true = correct
    timestamp: Date;
  }>;
}

export interface TopicProficiency {
  topicId: string;
  theta: number; // Proficiência estimada (IRT)
  lastReviewed: Date;
  reviewCount: number;
  correctCount: number;
  difficultyHistory: number[];
  irtAbility?: IRTAbility; // Full IRT ability estimation
}

export interface QuestionMetadata {
  id: string;
  topic: string;
  difficulty: number; // 1-5 scale (legacy)
  examType: string;
  tags: string[];
  irtParams?: IRTItemParameters; // Full IRT parameters
}

export interface RecommendationEngine {
  getRecommendations(
    userProficiencies: Record<string, TopicProficiency>,
    srsData: Record<string, SRSItem>,
    availableQuestions: QuestionMetadata[],
    sessionHistory: string[], // IDs de questões já respondidas na sessão
    targetCount: number
  ): QuestionMetadata[];
}

// IRT Model Implementation (3PL)
export class IRTModel {
  // 3PL Item Response Function: P(θ) = c + (1-c) / (1 + exp(-a(θ - b)))
  static probabilityCorrect(theta: number, item: IRTItemParameters): number {
    const { discrimination: a, difficulty: b, guessing: c } = item;
    return c + (1 - c) / (1 + Math.exp(-a * (theta - b)));
  }

  // Information function: I(θ) = a² * P(θ) * (1-P(θ)) / [(1-c)² * (1 + exp(a(θ-b)))²]
  static itemInformation(theta: number, item: IRTItemParameters): number {
    const p = this.probabilityCorrect(theta, item);
    const { discrimination: a, guessing: c } = item;
    const q = 1 - p;
    const numerator = a * a * p * q;
    const denominator = (1 - c) * (1 - c) * (1 + Math.exp(a * (theta - item.difficulty))) * (1 + Math.exp(a * (theta - item.difficulty)));
    return numerator / denominator;
  }

  // Maximum Likelihood Estimation of ability (simplified Newton-Raphson)
  static estimateAbility(responses: Array<{ item: IRTItemParameters; correct: boolean }>, maxIterations = 10): IRTAbility {
    let theta = 0; // Initial estimate
    let se = 1; // Initial standard error

    for (let iter = 0; iter < maxIterations; iter++) {
      let likelihoodFirstDerivative = 0;
      let likelihoodSecondDerivative = 0;
      let totalInformation = 0;

      for (const { item, correct } of responses) {
        const p = this.probabilityCorrect(theta, item);
        const info = this.itemInformation(theta, item);

        // Score contribution
        const score = correct ? 1 : 0;
        likelihoodFirstDerivative += item.discrimination * (score - p) / (1 - item.guessing);
        likelihoodSecondDerivative -= info;
        totalInformation += info;
      }

      // Newton-Raphson update
      if (Math.abs(likelihoodSecondDerivative) > 1e-6) {
        theta -= likelihoodFirstDerivative / likelihoodSecondDerivative;
      }

      // Standard error
      se = totalInformation > 0 ? 1 / Math.sqrt(totalInformation) : 1;

      // Convergence check
      if (Math.abs(likelihoodFirstDerivative) < 1e-4) break;
    }

    return {
      theta: Math.max(-4, Math.min(4, theta)), // Clamp to reasonable range
      se,
      lastUpdated: new Date(),
      responseHistory: responses.map(r => ({
        itemId: r.item.id,
        response: r.correct,
        timestamp: new Date()
      }))
    };
  }

  // Expected a posteriori estimation (EAP) with prior
  static estimateAbilityEAP(responses: Array<{ item: IRTItemParameters; correct: boolean }>): IRTAbility {
    // Use normal prior: N(0, 1)
    const priorMean = 0;
    const priorVariance = 1;

    let posteriorMean = priorMean;
    let posteriorVariance = priorVariance;

    for (const { item, correct } of responses) {
      const likelihood = correct ?
        this.probabilityCorrect(posteriorMean, item) :
        (1 - this.probabilityCorrect(posteriorMean, item));

      // Simplified EAP update (could be more sophisticated)
      const info = this.itemInformation(posteriorMean, item);
      const weight = info / (info + 1 / posteriorVariance);

      const expectedScore = this.probabilityCorrect(posteriorMean, item);
      const residual = (correct ? 1 : 0) - expectedScore;

      posteriorMean += weight * residual / item.discrimination;
      posteriorVariance = 1 / (1 / posteriorVariance + info);
    }

    return {
      theta: posteriorMean,
      se: Math.sqrt(posteriorVariance),
      lastUpdated: new Date(),
      responseHistory: responses.map(r => ({
        itemId: r.item.id,
        response: r.correct,
        timestamp: new Date()
      }))
    };
  }
}

export class AdaptiveRecommendationEngine implements RecommendationEngine {
  private readonly INTERLEAVING_WEIGHT = 0.2;
  private readonly DIFFICULTY_WEIGHT = 0.5;
  private readonly SRS_WEIGHT = 0.3;

  getRecommendations(
    userProficiencies: Record<string, TopicProficiency>,
    srsData: Record<string, SRSItem>,
    availableQuestions: QuestionMetadata[],
    sessionHistory: string[],
    targetCount: number
  ): QuestionMetadata[] {
    if (availableQuestions.length === 0) return [];

    // Filtrar questões já respondidas na sessão atual
    const availableFiltered = availableQuestions.filter(q => !sessionHistory.includes(q.id));

    if (availableFiltered.length === 0) return [];

    // Calcular scores para cada questão usando IRT completo
    const scoredQuestions = availableFiltered.map(question => {
      const score = this.calculateIRTRecommendationScore(
        question,
        userProficiencies[question.topic],
        srsData[question.id]
      );
      return { question, score };
    });

    // Ordenar por score (maior = melhor recomendação)
    scoredQuestions.sort((a, b) => b.score - a.score);

    // Aplicar interleaving: garantir diversidade de tópicos
    const interleaved = this.applyInterleaving(scoredQuestions.map(s => s.question), targetCount);

    return interleaved;
  }

  // Update ability estimation after a response
  updateAbilityEstimation(
    proficiency: TopicProficiency,
    question: QuestionMetadata,
    correct: boolean
  ): TopicProficiency {
    if (!question.irtParams) {
      // Fallback to simple update if no IRT params
      return {
        ...proficiency,
        theta: proficiency.theta + (correct ? 0.1 : -0.1),
        reviewCount: proficiency.reviewCount + 1,
        correctCount: proficiency.correctCount + (correct ? 1 : 0),
        difficultyHistory: [...proficiency.difficultyHistory, question.difficulty],
        lastReviewed: new Date()
      };
    }

    // Use IRT for ability estimation
    const responses = proficiency.irtAbility?.responseHistory || [];
    responses.push({
      itemId: question.id,
      response: correct,
      timestamp: new Date()
    });

    const irtResponses = responses.map(r => ({
      item: question.irtParams!, // This is simplified - in practice we'd need all items
      correct: r.response
    }));

    const newAbility = IRTModel.estimateAbilityEAP(irtResponses);

    return {
      ...proficiency,
      theta: newAbility.theta,
      reviewCount: proficiency.reviewCount + 1,
      correctCount: proficiency.correctCount + (correct ? 1 : 0),
      difficultyHistory: [...proficiency.difficultyHistory, question.difficulty],
      lastReviewed: new Date(),
      irtAbility: newAbility
    };
  }

  private calculateIRTRecommendationScore(
    question: QuestionMetadata,
    proficiency: TopicProficiency | undefined,
    srsItem: SRSItem | undefined
  ): number {
    let score = 0;
    const theta = proficiency?.irtAbility?.theta ?? proficiency?.theta ?? 0;

    // 1. IRT-based difficulty matching (optimal challenge)
    if (question.irtParams) {
      // Use full 3PL IRT model
      const probCorrect = IRTModel.probabilityCorrect(theta, question.irtParams);
      const information = IRTModel.itemInformation(theta, question.irtParams);

      // Optimal probability range: 0.65-0.85 (desirable difficulty)
      const optimalProb = 0.75;
      const difficultyScore = 1 - Math.abs(probCorrect - optimalProb) / optimalProb;

      // Bonus for high information items (good discrimination)
      const informationBonus = Math.min(information / 2, 1); // Cap at 1

      score += (difficultyScore + informationBonus) * 0.5 * this.DIFFICULTY_WEIGHT;
    } else {
      // Fallback to simplified model
      const probCorrect = 1 / (1 + Math.exp(-(theta - question.difficulty)));
      const optimalProb = 0.75;
      const difficultyScore = 1 - Math.abs(probCorrect - optimalProb);
      score += difficultyScore * this.DIFFICULTY_WEIGHT;
    }

    // 2. SRS-based timing (spaced repetition)
    if (srsItem) {
      const now = new Date();
      const timeUntilDue = srsItem.nextReview.getTime() - now.getTime();
      const daysUntilDue = timeUntilDue / (1000 * 60 * 60 * 24);

      if (daysUntilDue <= 0) {
        // Overdue: highest priority
        score += 1.0 * this.SRS_WEIGHT;
      } else if (daysUntilDue <= 1) {
        // Due soon: high priority
        score += 0.8 * this.SRS_WEIGHT;
      } else if (daysUntilDue <= 3) {
        // Due within a few days: medium priority
        score += 0.5 * this.SRS_WEIGHT;
      } else {
        // Not due yet: low priority
        score += 0.2 * this.SRS_WEIGHT;
      }
    } else {
      // New item: medium priority
      score += 0.4 * this.SRS_WEIGHT;
    }

    // 3. Topic diversity bonus (interleaving)
    score += this.INTERLEAVING_WEIGHT;

    return score;
  }

  // Utility function to generate IRT parameters for a question
  static generateIRTParameters(question: QuestionMetadata): IRTItemParameters {
    // Convert legacy difficulty (1-5) to IRT difficulty parameter
    // IRT difficulty is typically in logits, where 0 = average difficulty
    const irtDifficulty = (question.difficulty - 3) * 0.5; // Scale to reasonable range

    // Generate reasonable discrimination and guessing parameters
    const discrimination = 0.8 + Math.random() * 0.4; // 0.8-1.2 range
    const guessing = Math.random() * 0.2; // 0-0.2 range (guessing parameter)

    return {
      id: question.id,
      difficulty: irtDifficulty,
      discrimination,
      guessing,
      topic: question.topic,
      examType: question.examType,
      tags: question.tags
    };
  }

  // Utility function to convert legacy questions to IRT format
  static convertToIRTQuestions(questions: QuestionMetadata[]): QuestionMetadata[] {
    return questions.map(q => ({
      ...q,
      irtParams: this.generateIRTParameters(q)
    }));
  }

  private applyInterleaving(questions: QuestionMetadata[], targetCount: number): QuestionMetadata[] {
    if (questions.length <= targetCount) return questions;

    const result: QuestionMetadata[] = [];
    const topicGroups = new Map<string, QuestionMetadata[]>();

    // Agrupar por tópico
    questions.forEach(q => {
      if (!topicGroups.has(q.topic)) {
        topicGroups.set(q.topic, []);
      }
      topicGroups.get(q.topic)!.push(q);
    });

    // Round-robin entre tópicos até atingir targetCount
    const topicList = Array.from(topicGroups.keys());
    let topicIndex = 0;

    while (result.length < targetCount && topicList.length > 0) {
      const currentTopic = topicList[topicIndex % topicList.length];
      const topicQuestions = topicGroups.get(currentTopic)!;

      if (topicQuestions.length > 0) {
        // Pegar a melhor questão deste tópico
        result.push(topicQuestions.shift()!);
      } else {
        // Tópico esgotado, remover da rotação
        topicList.splice(topicIndex % topicList.length, 1);
        topicIndex--;
      }

      topicIndex++;
    }

    return result;
  }
}

// Instância singleton
export const recommendationEngine = new AdaptiveRecommendationEngine();