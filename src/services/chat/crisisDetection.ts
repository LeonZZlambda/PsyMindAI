/**
 * Crisis Detection Module
 * 
 * This module is responsible for intercepting messages and detecting severe crisis
 * indicators such as suicidal ideation, self-harm, or abuse, ensuring the AI
 * does not attempt to clinically treat high-risk situations.
 */

// Regex patterns to match crisis-related terms in Portuguese and English
const CRISIS_PATTERNS = [
  // Suicidal ideation / Self-harm (PT)
  /quero\s+(morrer|me\s+matar|sumir|desaparecer\s+para\s+sempre)/i,
  /n(a|ã)o\s+quero\s+mais\s+viver/i,
  /tirar\s+(a\s+minha\s+vida|minha\s+vida)/i,
  /pensando\s+em\s+suic(i|í)dio/i,
  /acabar\s+com\s+tudo/i,
  /cortar\s+(os\s+pulsos|meus\s+pulsos)/i,
  /me\s+machucar/i,
  /sem\s+motivo\s+para\s+viver/i,
  /melhor\s+se\s+eu\s+n(a|ã)o\s+existisse/i,
  
  // Suicidal ideation / Self-harm (EN)
  /want\s+to\s+(die|kill\s+myself|end\s+it\s+all)/i,
  /don'?t\s+want\s+to\s+live/i,
  /thinking\s+about\s+suicide/i,
  /take\s+my\s+(own\s+)?life/i,
  /hurt\s+myself/i,
  /better\s+off\s+dead/i,
  /no\s+reason\s+to\s+live/i,
  
  // Abuse / Violence (PT/EN combined heuristics)
  /est(a|á)\s+me\s+batendo/i,
  /sofrendo\s+abuso/i,
  /sendo\s+abusad(a|o)/i,
  /being\s+abused/i,
  /hitting\s+me/i,
  /domestic\s+violence/i,
  /viol(ê|e)ncia\s+dom(é|e)stica/i
];

/**
 * Evaluates a message string against crisis patterns.
 * @param message The user's input text
 * @returns true if a crisis is detected, false otherwise
 */
export function detectCrisis(message: string): boolean {
  if (!message || typeof message !== 'string') return false;
  
  const normalizedMessage = message.trim();
  
  for (const pattern of CRISIS_PATTERNS) {
    if (pattern.test(normalizedMessage)) {
      return true;
    }
  }
  
  return false;
}
