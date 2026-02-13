
export enum WizardStep {
  WELCOME = 'WELCOME',
  TEASE_1 = 'TEASE_1',
  TEASE_2 = 'TEASE_2',
  TEASE_3 = 'TEASE_3',
  TEASE_4 = 'TEASE_4',
  TEASE_5 = 'TEASE_5',
  GENERATOR = 'GENERATOR',
  FINAL = 'FINAL'
}

export interface MemoryData {
  photoUrl: string | null;
  caption: string;
}

export interface ValentineState {
  currentStep: WizardStep;
  photos: string[];
  magicMessage: string;
  names: {
    partner: string;
    me: string;
  };
}
