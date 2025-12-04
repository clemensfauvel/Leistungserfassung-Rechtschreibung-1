export interface ServiceType {
  label: string;
  description: string;
}

export interface SpellCheckCorrection {
  original: string;
  suggestion: string;
  reason: string;
}

export interface SpellCheckResponse {
  language: string;
  corrections: SpellCheckCorrection[];
}
