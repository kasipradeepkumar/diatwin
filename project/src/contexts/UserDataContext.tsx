import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { UserProfile, RiskAssessment, DailyEntry, Simulation } from '../types';

interface UserDataContextType {
  userProfile: UserProfile | null;
  riskAssessment: RiskAssessment | null;
  dailyEntries: DailyEntry[];
  currentSimulation: Simulation | null;
  saveProfile: (profile: UserProfile) => Promise<void>;
  updateHealthMetrics: (metrics: DailyEntry['healthMetrics']) => Promise<void>;
  addFoodItem: (food: DailyEntry['meals'][0]) => Promise<void>;
  runSimulation: (foods: Array<DailyEntry['meals'][0]>) => Promise<Simulation>;
  isLoading: boolean;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [currentSimulation, setCurrentSimulation] = useState<Simulation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock functions to simulate API calls
  const saveProfile = async (profile: UserProfile) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUserProfile(profile);
    
    // Generate mock risk assessment based on profile
    const mockRiskAssessment: RiskAssessment = {
      status: profile.highBP && profile.highChol ? 'diabetic' : 
              profile.highBP || profile.highChol ? 'pre-diabetic' : 'non-diabetic',
      riskLevel: profile.highBP && profile.highChol ? 75 : 
                profile.highBP || profile.highChol ? 45 : 25,
      keyFactors: [
        { factor: 'High Blood Pressure', impact: profile.highBP ? 30 : 0 },
        { factor: 'High Cholesterol', impact: profile.highChol ? 25 : 0 },
        { factor: 'Physical Activity', impact: profile.physActivity ? -15 : 10 },
        { factor: 'BMI', impact: profile.bmi > 25 ? 20 : 0 }
      ],
      suggestions: [
        'Increase your physical activity',
        'Maintain a balanced diet rich in fruits and vegetables',
        'Monitor your blood pressure regularly',
        'Schedule regular cholesterol checks'
      ]
    };
    
    setRiskAssessment(mockRiskAssessment);
    setIsLoading(false);
    
    // Update user profile complete status in local storage
    if (currentUser) {
      const updatedUser = { ...currentUser, profileComplete: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    // Store profile in local storage
    localStorage.setItem('userProfile', JSON.stringify(profile));
    localStorage.setItem('riskAssessment', JSON.stringify(mockRiskAssessment));
  };

  const updateHealthMetrics = async (metrics: DailyEntry['healthMetrics']) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const today = new Date().toISOString().split('T')[0];
    const existingEntryIndex = dailyEntries.findIndex(entry => entry.date === today);
    
    if (existingEntryIndex >= 0) {
      const updatedEntries = [...dailyEntries];
      updatedEntries[existingEntryIndex] = {
        ...updatedEntries[existingEntryIndex],
        healthMetrics: { ...updatedEntries[existingEntryIndex].healthMetrics, ...metrics }
      };
      setDailyEntries(updatedEntries);
      localStorage.setItem('dailyEntries', JSON.stringify(updatedEntries));
    } else {
      const newEntry: DailyEntry = {
        date: today,
        meals: [],
        healthMetrics: metrics,
        riskLevel: riskAssessment?.riskLevel || 0,
        suggestions: []
      };
      const updatedEntries = [...dailyEntries, newEntry];
      setDailyEntries(updatedEntries);
      localStorage.setItem('dailyEntries', JSON.stringify(updatedEntries));
    }
    
    setIsLoading(false);
  };

  const addFoodItem = async (food: DailyEntry['meals'][0]) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const today = new Date().toISOString().split('T')[0];
    const existingEntryIndex = dailyEntries.findIndex(entry => entry.date === today);
    
    if (existingEntryIndex >= 0) {
      const updatedEntries = [...dailyEntries];
      updatedEntries[existingEntryIndex] = {
        ...updatedEntries[existingEntryIndex],
        meals: [...updatedEntries[existingEntryIndex].meals, food]
      };
      setDailyEntries(updatedEntries);
      localStorage.setItem('dailyEntries', JSON.stringify(updatedEntries));
    } else {
      const newEntry: DailyEntry = {
        date: today,
        meals: [food],
        healthMetrics: {},
        riskLevel: riskAssessment?.riskLevel || 0,
        suggestions: []
      };
      const updatedEntries = [...dailyEntries, newEntry];
      setDailyEntries(updatedEntries);
      localStorage.setItem('dailyEntries', JSON.stringify(updatedEntries));
    }
    
    setIsLoading(false);
  };

  const runSimulation = async (foods: Array<DailyEntry['meals'][0]>): Promise<Simulation> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Calculate total sugar and calories for risk assessment
    const totalSugar = foods.reduce((sum, food) => sum + food.sugar, 0);
    const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
    
    // Generate mock simulation results
    const mockSimulation: Simulation = {
      foods,
      resultingRisk: Math.min(90, (riskAssessment?.riskLevel || 30) + (totalSugar * 0.5) + (totalCalories * 0.01)),
      recommendation: {
        alternative: foods.map(food => ({
          ...food,
          calories: Math.round(food.calories * 0.7),
          sugar: Math.round(food.sugar * 0.5),
          carbs: Math.round(food.carbs * 0.8),
          name: `Healthier ${food.name}`,
          id: `alt-${food.id}`
        })),
        riskReduction: 15
      }
    };
    
    setCurrentSimulation(mockSimulation);
    setIsLoading(false);
    return mockSimulation;
  };

  // Load data from localStorage on mount
  useEffect(() => {
    if (currentUser) {
      const storedProfile = localStorage.getItem('userProfile');
      const storedRiskAssessment = localStorage.getItem('riskAssessment');
      const storedDailyEntries = localStorage.getItem('dailyEntries');
      
      if (storedProfile) setUserProfile(JSON.parse(storedProfile));
      if (storedRiskAssessment) setRiskAssessment(JSON.parse(storedRiskAssessment));
      if (storedDailyEntries) setDailyEntries(JSON.parse(storedDailyEntries));
    }
  }, [currentUser]);

  const value = {
    userProfile,
    riskAssessment,
    dailyEntries,
    currentSimulation,
    saveProfile,
    updateHealthMetrics,
    addFoodItem,
    runSimulation,
    isLoading
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};