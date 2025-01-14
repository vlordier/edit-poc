import { type Suggestion, ImprovementType } from '@/types/suggestions';
import { z } from 'zod';

export const improvementSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  range: z.tuple([z.number(), z.number()]).optional()
});

export const suggestionSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(ImprovementType),
  rationale: z.string().min(1),
  improvements: z.array(improvementSchema).min(1),
  createdAt: z.string().datetime()
});

export const validateSuggestion = (suggestion: unknown): Suggestion => {
  return suggestionSchema.parse(suggestion);
};

export const validateSuggestions = (suggestions: unknown[]): Suggestion[] => {
  return z.array(suggestionSchema).parse(suggestions);
};
