import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserData } from '../contexts/UserDataContext';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { UserProfile } from '../types';

const initialProfile: UserProfile = {
  age: 30,
  sex: 'male',
  education: 'College',
  income: 'Middle',
  highBP: false,
  highChol: false,
  cholCheck: false,
  smoker: false,
  stroke: false,
  heartDiseaseOrAttack: false,
  physActivity: true,
  fruits: true,
  veggies: true,
  alcohol: false,
  bmi: 24.5,
  mentalHealth: 5,
  physicalHealth: 3,
  diffWalking: false,
  sleepTime: 7
};

const ProfileSetupPage = () => {
  const { currentUser } = useAuth();
  const { saveProfile, isLoading, userProfile } = useUserData();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const navigate = useNavigate();
  
  // Update page title
  useEffect(() => {
    document.title = 'Profile Setup - DiaTwin';
  }, []);
  
  // If user already has a profile, redirect to dashboard
  useEffect(() => {
    if (currentUser?.profileComplete && userProfile) {
      navigate('/dashboard');
    }
  }, [currentUser, userProfile, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
    }));
  };
  
  const nextStep = () => {
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProfile(profile);
    navigate('/dashboard');
  };
  
  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div 
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  s === step ? 'bg-blue-600 text-white' 
                  : s < step ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s < step ? <Check size={16} /> : s}
              </div>
              
              {s < 3 && (
                <div className={`w-12 h-1 ${s < step ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Personal Info</span>
          <span>Medical History</span>
          <span>Lifestyle</span>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-2">Complete Your Health Profile</h1>
          <p className="text-gray-600 mb-6">
            We'll use this information to create your personalized diabetes risk assessment.
          </p>
          
          {renderStepIndicator()}
          
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    min="18"
                    max="100"
                    value={profile.age}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-1">
                    Sex
                  </label>
                  <select
                    id="sex"
                    name="sex"
                    value={profile.sex}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                    Education Level
                  </label>
                  <select
                    id="education"
                    name="education"
                    value={profile.education}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Elementary">Elementary</option>
                    <option value="High School">High School</option>
                    <option value="College">College</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-1">
                    Income Level
                  </label>
                  <select
                    id="income"
                    name="income"
                    value={profile.income}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Middle">Middle</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Medical History</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="highBP"
                      name="highBP"
                      checked={profile.highBP}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="highBP" className="ml-2 block text-sm text-gray-700">
                      High Blood Pressure
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="highChol"
                      name="highChol"
                      checked={profile.highChol}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="highChol" className="ml-2 block text-sm text-gray-700">
                      High Cholesterol
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cholCheck"
                      name="cholCheck"
                      checked={profile.cholCheck}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="cholCheck" className="ml-2 block text-sm text-gray-700">
                      Cholesterol Check in Past 5 Years
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="smoker"
                      name="smoker"
                      checked={profile.smoker}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="smoker" className="ml-2 block text-sm text-gray-700">
                      Smoker
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="stroke"
                      name="stroke"
                      checked={profile.stroke}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="stroke" className="ml-2 block text-sm text-gray-700">
                      Had a Stroke
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="heartDiseaseOrAttack"
                      name="heartDiseaseOrAttack"
                      checked={profile.heartDiseaseOrAttack}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="heartDiseaseOrAttack" className="ml-2 block text-sm text-gray-700">
                      Heart Disease or Heart Attack
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Lifestyle</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="bmi" className="block text-sm font-medium text-gray-700 mb-1">
                      BMI (Body Mass Index)
                    </label>
                    <input
                      type="number"
                      id="bmi"
                      name="bmi"
                      min="10"
                      max="60"
                      step="0.1"
                      value={profile.bmi}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="sleepTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Sleep Time (hours per day)
                    </label>
                    <input
                      type="number"
                      id="sleepTime"
                      name="sleepTime"
                      min="1"
                      max="24"
                      step="0.5"
                      value={profile.sleepTime}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="physActivity"
                      name="physActivity"
                      checked={profile.physActivity}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="physActivity" className="ml-2 block text-sm text-gray-700">
                      Physical Activity in Past 30 Days
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="fruits"
                      name="fruits"
                      checked={profile.fruits}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="fruits" className="ml-2 block text-sm text-gray-700">
                      Consume Fruits Daily
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="veggies"
                      name="veggies"
                      checked={profile.veggies}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="veggies" className="ml-2 block text-sm text-gray-700">
                      Consume Vegetables Daily
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="alcohol"
                      name="alcohol"
                      checked={profile.alcohol}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="alcohol" className="ml-2 block text-sm text-gray-700">
                      Heavy Alcohol Consumption
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="diffWalking"
                      name="diffWalking"
                      checked={profile.diffWalking}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="diffWalking" className="ml-2 block text-sm text-gray-700">
                      Difficulty Walking or Climbing Stairs
                    </label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="mentalHealth" className="block text-sm font-medium text-gray-700 mb-1">
                      Mental Health (Stress days per month)
                    </label>
                    <input
                      type="range"
                      id="mentalHealth"
                      name="mentalHealth"
                      min="0"
                      max="30"
                      step="1"
                      value={profile.mentalHealth}
                      onChange={handleChange}
                      className="block w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0 days</span>
                      <span>{profile.mentalHealth} days</span>
                      <span>30 days</span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="physicalHealth" className="block text-sm font-medium text-gray-700 mb-1">
                      Physical Health (Illness days per month)
                    </label>
                    <input
                      type="range"
                      id="physicalHealth"
                      name="physicalHealth"
                      min="0"
                      max="30"
                      step="1"
                      value={profile.physicalHealth}
                      onChange={handleChange}
                      className="block w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0 days</span>
                      <span>{profile.physicalHealth} days</span>
                      <span>30 days</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Previous
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="ml-auto flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2">Processing</span>
                      <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    </>
                  ) : (
                    'Complete Profile'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;