export interface User {
  id: string;
  email: string;
  name?: string;
  profileComplete: boolean;
}

export interface UserProfile {
  // Personal
  age: number;
  sex: 'male' | 'female' | 'other';
  education: string;
  income: string;
  
  // Medical
  highBP: boolean;
  highChol: boolean;
  cholCheck: boolean;
  smoker: boolean;
  stroke: boolean;
  heartDiseaseOrAttack: boolean;
  physActivity: boolean;
  fruits: boolean;
  veggies: boolean;
  
  // Lifestyle
  alcohol: boolean;
  bmi: number;
  mentalHealth: number;
  physicalHealth: number;
  diffWalking: boolean;
  sleepTime: number;
}

export interface RiskAssessment {
  status: 'non-diabetic' | 'pre-diabetic' | 'diabetic';
  riskLevel: number; // 0-100
  keyFactors: Array<{factor: string; impact: number}>;
  suggestions: string[];
}

export interface DailyEntry {
  date: string;
  meals: FoodItem[];
  healthMetrics: HealthMetrics;
  riskLevel: number; // 0-100
  suggestions: string[];
}

export interface FoodItem {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  sugar: number;
  timeOfDay: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface HealthMetrics {
  hba1c?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  cholesterolTotal?: number;
  cholesterolHDL?: number;
  cholesterolLDL?: number;
  weight?: number;
}

export interface Simulation {
  foods: FoodItem[];
  resultingRisk: number;
  recommendation: {
    alternative: FoodItem[];
    riskReduction: number;
  };
}