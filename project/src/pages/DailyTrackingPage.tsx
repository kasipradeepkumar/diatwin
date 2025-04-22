import { useState, useEffect } from 'react';
import { useUserData } from '../contexts/UserDataContext';
import { Search, PlusCircle, Hash, ArrowRight } from 'lucide-react';
import { FoodItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

const mockFoodDatabase = [
  { id: '1', name: 'Apple', servingSize: '1 medium (182g)', calories: 95, carbs: 25, protein: 0.5, fat: 0.3, sugar: 19 },
  { id: '2', name: 'Banana', servingSize: '1 medium (118g)', calories: 105, carbs: 27, protein: 1.3, fat: 0.4, sugar: 14 },
  { id: '3', name: 'Grilled Chicken Breast', servingSize: '3 oz (85g)', calories: 128, carbs: 0, protein: 26, fat: 2.7, sugar: 0 },
  { id: '4', name: 'Brown Rice', servingSize: '1 cup cooked (195g)', calories: 216, carbs: 45, protein: 5, fat: 1.8, sugar: 0.7 },
  { id: '5', name: 'Salmon', servingSize: '3 oz (85g)', calories: 177, carbs: 0, protein: 19, fat: 11, sugar: 0 },
  { id: '6', name: 'Avocado', servingSize: '1/2 medium (68g)', calories: 114, carbs: 6, protein: 1.3, fat: 10.5, sugar: 0.2 },
  { id: '7', name: 'Broccoli', servingSize: '1 cup chopped (91g)', calories: 31, carbs: 6, protein: 2.6, fat: 0.3, sugar: 1.5 },
  { id: '8', name: 'Whole Wheat Bread', servingSize: '1 slice (43g)', calories: 120, carbs: 20, protein: 4, fat: 2, sugar: 3 },
  { id: '9', name: 'Soda', servingSize: '12 oz can (355ml)', calories: 140, carbs: 39, protein: 0, fat: 0, sugar: 39 },
  { id: '10', name: 'Pizza', servingSize: '1 slice (63g)', calories: 285, carbs: 36, protein: 12, fat: 10, sugar: 3.8 }
];

const DailyTrackingPage = () => {
  const { dailyEntries, addFoodItem, updateHealthMetrics, isLoading } = useUserData();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<typeof mockFoodDatabase>([]);
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [todayEntries, setTodayEntries] = useState<FoodItem[]>([]);
  const [showHealthMetricsForm, setShowHealthMetricsForm] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState({
    weight: '' as unknown as number | undefined,
    bloodPressureSystolic: '' as unknown as number | undefined,
    bloodPressureDiastolic: '' as unknown as number | undefined,
    hba1c: '' as unknown as number | undefined
  });
  
  // Update page title
  useEffect(() => {
    document.title = 'Daily Tracking - DiaTwin';
  }, []);
  
  // Get today's entries
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = dailyEntries.find(entry => entry.date === today);
    
    if (todayEntry) {
      setTodayEntries(todayEntry.meals);
    } else {
      setTodayEntries([]);
    }
  }, [dailyEntries]);
  
  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (term.trim().length > 2) {
      const results = mockFoodDatabase.filter(food => 
        food.name.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchDropdown(true);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };
  
  // Handle food selection
  const handleFoodSelect = async (food: typeof mockFoodDatabase[0]) => {
    const newFood: FoodItem = {
      id: uuidv4(),
      name: food.name,
      servingSize: food.servingSize,
      calories: food.calories,
      carbs: food.carbs,
      protein: food.protein,
      fat: food.fat,
      sugar: food.sugar,
      timeOfDay: selectedMeal
    };
    
    await addFoodItem(newFood);
    setSearchTerm('');
    setShowSearchDropdown(false);
  };
  
  // Handle health metrics change
  const handleMetricsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHealthMetrics(prev => ({
      ...prev,
      [name]: value === '' ? undefined : parseFloat(value)
    }));
  };
  
  // Submit health metrics
  const handleMetricsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateHealthMetrics(healthMetrics);
    setShowHealthMetricsForm(false);
  };
  
  // Calculate nutrition totals
  const calculateTotals = () => {
    return todayEntries.reduce(
      (totals, food) => {
        totals.calories += food.calories;
        totals.carbs += food.carbs;
        totals.protein += food.protein;
        totals.fat += food.fat;
        totals.sugar += food.sugar;
        return totals;
      },
      { calories: 0, carbs: 0, protein: 0, fat: 0, sugar: 0 }
    );
  };
  
  // Group meals by time of day
  const mealsByTimeOfDay = todayEntries.reduce(
    (groups, food) => {
      if (!groups[food.timeOfDay]) {
        groups[food.timeOfDay] = [];
      }
      groups[food.timeOfDay].push(food);
      return groups;
    },
    {} as Record<string, FoodItem[]>
  );
  
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">Daily Tracking</h1>
            <p className="text-gray-600 mb-6">
              Track your food intake and health metrics to monitor your diabetes risk.
            </p>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="text-xl font-medium">
                Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
              
              <button 
                onClick={() => setShowHealthMetricsForm(!showHealthMetricsForm)}
                className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition flex items-center justify-center text-sm"
              >
                <Hash size={16} className="mr-2" />
                {showHealthMetricsForm ? 'Hide Health Metrics' : 'Add Health Metrics'}
              </button>
            </div>
            
            {showHealthMetricsForm && (
              <div className="bg-blue-50 rounded-lg p-4 mb-8 border border-blue-100">
                <h2 className="font-medium mb-4">Health Metrics</h2>
                
                <form onSubmit={handleMetricsSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      id="weight"
                      name="weight"
                      value={healthMetrics.weight === undefined ? '' : healthMetrics.weight}
                      onChange={handleMetricsChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="70.5"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="bloodPressureSystolic" className="block text-sm font-medium text-gray-700 mb-1">
                        BP Systolic
                      </label>
                      <input
                        type="number"
                        id="bloodPressureSystolic"
                        name="bloodPressureSystolic"
                        value={healthMetrics.bloodPressureSystolic === undefined ? '' : healthMetrics.bloodPressureSystolic}
                        onChange={handleMetricsChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="120"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="bloodPressureDiastolic" className="block text-sm font-medium text-gray-700 mb-1">
                        BP Diastolic
                      </label>
                      <input
                        type="number"
                        id="bloodPressureDiastolic"
                        name="bloodPressureDiastolic"
                        value={healthMetrics.bloodPressureDiastolic === undefined ? '' : healthMetrics.bloodPressureDiastolic}
                        onChange={handleMetricsChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="80"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="hba1c" className="block text-sm font-medium text-gray-700 mb-1">
                      HbA1c (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      id="hba1c"
                      name="hba1c"
                      value={healthMetrics.hba1c === undefined ? '' : healthMetrics.hba1c}
                      onChange={handleMetricsChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="5.7"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                      ) : (
                        'Save Metrics'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            <div className="border-b border-gray-200 pb-4 mb-6">
              <div className="flex space-x-2 mb-4">
                <button 
                  onClick={() => setSelectedMeal('breakfast')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedMeal === 'breakfast' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition`}
                >
                  Breakfast
                </button>
                
                <button 
                  onClick={() => setSelectedMeal('lunch')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedMeal === 'lunch' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition`}
                >
                  Lunch
                </button>
                
                <button 
                  onClick={() => setSelectedMeal('dinner')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedMeal === 'dinner' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition`}
                >
                  Dinner
                </button>
                
                <button 
                  onClick={() => setSelectedMeal('snack')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedMeal === 'snack' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition`}
                >
                  Snack
                </button>
              </div>
              
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                  <div className="pl-3 pr-2">
                    <Search size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search for food..."
                    className="py-2 block w-full outline-none border-0 focus:ring-0"
                  />
                  <div className="pr-3">
                    <PlusCircle size={20} className="text-blue-500" />
                  </div>
                </div>
                
                {showSearchDropdown && searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
                    {searchResults.map((food) => (
                      <div 
                        key={food.id}
                        className="p-3 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleFoodSelect(food)}
                      >
                        <div className="font-medium">{food.name}</div>
                        <div className="text-sm text-gray-500">
                          {food.servingSize} • {food.calories} cal
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Today's Food Log</h2>
              
              {Object.keys(mealsByTimeOfDay).length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500">No meals logged today. Start by searching for food above.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {['breakfast', 'lunch', 'dinner', 'snack'].map((timeOfDay) => {
                    const foods = mealsByTimeOfDay[timeOfDay] || [];
                    if (foods.length === 0) return null;
                    
                    return (
                      <div key={timeOfDay} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                        <h3 className="text-lg font-medium mb-3 capitalize">{timeOfDay}</h3>
                        <div className="space-y-2">
                          {foods.map((food) => (
                            <div 
                              key={food.id}
                              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                            >
                              <div>
                                <div className="font-medium">{food.name}</div>
                                <div className="text-sm text-gray-500">{food.servingSize}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{food.calories} cal</div>
                                <div className="text-sm text-gray-500">
                                  Carbs: {food.carbs}g • Sugar: {food.sugar}g
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {Object.keys(mealsByTimeOfDay).length > 0 && (
                <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h3 className="font-semibold mb-3">Daily Nutrition Summary</h3>
                  
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {Object.entries(calculateTotals()).map(([key, value]) => (
                      <div key={key} className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-sm text-gray-500 capitalize">{key}</div>
                        <div className="font-bold text-lg">{Math.round(value)}{key !== 'calories' ? 'g' : ''}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <a 
                      href="/simulator"
                      className="flex items-center text-blue-600 hover:text-blue-800 transition font-medium"
                    >
                      Try food simulator
                      <ArrowRight size={16} className="ml-1" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTrackingPage;