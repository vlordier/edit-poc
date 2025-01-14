export enum ImprovementType {
  GRAMMAR = 'GRAMMAR',
  STYLE = 'STYLE',
  CLARITY = 'CLARITY',
  CONCISENESS = 'CONCISENESS'
}

export interface Improvement {
  id: string;
  text: string;
  range?: [number, number];
}

export interface Suggestion {
  id: string;
  type: ImprovementType;
  rationale: string;
  improvements: Improvement[];
  createdAt: string;
}

export const IMPROVEMENT_TYPES: Record<ImprovementType, string> = {
  [ImprovementType.GRAMMAR]: 'Grammar',
  [ImprovementType.STYLE]: 'Style',
  [ImprovementType.CLARITY]: 'Clarity',
  [ImprovementType.CONCISENESS]: 'Conciseness'
};
