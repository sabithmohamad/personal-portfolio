import type { ApiChatMessage, PortfolioIntent } from '@/types/chat';

import { buildConversationTranscript, buildIntentContext, generateFallbackAnswer } from '@/lib/portfolio-data';

export const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

export const sanitizeMessages = (messages: unknown): ApiChatMessage[] => {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter(
      (message): message is ApiChatMessage =>
        typeof message === 'object' &&
        message !== null &&
        'role' in message &&
        'content' in message &&
        (message.role === 'user' || message.role === 'assistant') &&
        typeof message.content === 'string',
    )
    .map(message => ({
      role: message.role,
      content: message.content.trim().slice(0, 4000),
    }))
    .filter(message => message.content.length > 0);
};

const isFitQuestion = (message: string) =>
  /\b(why should (i|we) hire you|why hire you|good fit|choose you|convince me|bring to a team)\b/i.test(message);

const isSpecialtyQuestion = (message: string) =>
  /\b(what do you specialize in|specialt(?:y|ies)|specialit(?:y|ies)|specalities|what are you best at|what is your edge)\b/i.test(message);

const buildReasoningGuidance = (message: string) => {
  if (isFitQuestion(message)) {
    return 'For fit or hire questions, explain how you think, where you create leverage, and why that helps a team. Use selective proof points instead of a resume list.';
  }

  if (isSpecialtyQuestion(message)) {
    return 'For specialty questions, describe your lane in terms of problem-solving style, constraints you handle well, and the kind of frontend work where you are strongest.';
  }

  return 'Default to concise, conversational portfolio answers grounded in the supplied facts.';
};

export const buildSystemPrompt = (intent: PortfolioIntent, latestUserMessage: string) => `
You are Mohammad Sabith speaking through your portfolio website.

Rules:
- Always answer in first person as Mohammad Sabith.
- If someone asks who you are, say you are Mohammad Sabith, a frontend engineer.
- If someone asks why they should hire you, answer like Sabith explaining his strengths, impact, and fit.
- For hire, specialty, strengths, or fit questions, do not sound like a resume summary.
- Instead, explain how you think, what kind of frontend problems you solve well, the tradeoffs you care about, and why that creates value for a team.
- Do not refer to yourself in the third person unless the user explicitly asks for a third-person bio.
- If someone asks whether this is AI, Gemini, GPT, or anything similar, give a short playful answer and then steer back to Sabith's portfolio.
- Answer only about Sabith's experience, projects, skills, resume, contact details, location, and role fit.
- Stay concise, confident, and high-signal.
- Use only the facts provided in the context.
- Do not invent metrics, dates, company details, links, technologies, or personal information.
- If the question is outside portfolio scope, be lightly witty, brief, and redirect back to Sabith's work.
- Keep the answer to at most 2 short paragraphs or 4 short bullets.
- Avoid emojis, hype, and filler.

Current intent classification: ${intent}
Answer-shaping guidance: ${buildReasoningGuidance(latestUserMessage)}
`.trim();

export const buildModelInput = (intent: PortfolioIntent, messages: ApiChatMessage[]) => {
  const latestUserMessage = [...messages].reverse().find(message => message.role === 'user')?.content ?? '';

  return [
    'The visitor is chatting directly with Mohammad Sabith on his portfolio website.',
    'Answer as Sabith in first person and stay grounded only in the provided facts.',
    `Reasoning guidance: ${buildReasoningGuidance(latestUserMessage)}`,
    `Latest user message: ${latestUserMessage}`,
    `Conversation transcript:\n${buildConversationTranscript(messages) || 'None'}`,
    `Relevant portfolio data:\n${buildIntentContext(intent, latestUserMessage)}`,
  ].join('\n\n');
};

export const chunkText = (text: string) => {
  const tokens = text.match(/\S+\s*/g) ?? [text];
  return tokens.filter(Boolean);
};

export const getFallbackStreamText = (intent: PortfolioIntent, latestUserMessage: string) =>
  generateFallbackAnswer(intent, latestUserMessage);
