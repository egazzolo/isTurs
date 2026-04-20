import { z } from "zod";

export const QuizQuestion = z.object({
  id: z.string(),
  prompt: z.string().min(1),
  options: z
    .array(z.object({ id: z.string(), text: z.string().min(1), correct: z.boolean() }))
    .min(2)
    .max(6),
  timeLimitSec: z.number().int().positive().max(120).optional(),
});

export const QuizContent = z.object({
  questions: z.array(QuizQuestion).min(1).max(50),
  settings: z
    .object({
      shuffleQuestions: z.boolean().default(false),
      shuffleOptions: z.boolean().default(true),
      showAnswersAtEnd: z.boolean().default(true),
    })
    .default({}),
});

export type QuizQuestionType = z.infer<typeof QuizQuestion>;
export type QuizContentType = z.infer<typeof QuizContent>;
