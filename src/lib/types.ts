export type QuestionType = 'single' | 'multiple';

export interface Question {
  id: number;
  question: string;
  type: QuestionType;
  options: string[];
  correct: number[];
}
