import { useState, useEffect } from 'react';
import { useUserData } from '../contexts/UserDataContext';
import { Search, AlertTriangle, Lightbulb, RefreshCw, Check, ArrowRight } from 'lucide-react';
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
  { id: '10', name: 'Pizza', servingSize: '1 slice (63g)', calories: 285, carbs: 36, protein: 12, fat: 10, sugar: 3.8 },
  { id: '11', name: 'Hamburger', servingSize: '1 regular (110g)', calories: 354, carbs: 26, protein: 20, fat: 17, sugar: 6 },
  { id: '12', name: 'French Fries', servingSize: 'Medium serving (117g)', calories: 365, carbs: 48, protein: 4, fat: 18, sugar: 0.4 },
  { id: '13', name: 'Ice Cream', servingSize: '1/2 cup (66g)', calories: 137, carbs: 16, protein: 2.3, fat: 7, sugar: 14 },
  { id: '14', name: 'Orange Juice', servingSize: '1 cup (248g)', calories: 112, carbs: 26, protein: 1.7, fat: 0.5, sugar: 21 },
  { id: '15', name: 'Greek Yogurt', servingSize: '6 oz (170g)', calories: 100, carbs: 6, protein: 17, fat: 0, sugar: 6 }
];

// Get risk color based on value
const getRiskColor = (risk: number) => {
  if (risk < 30) return { bg: 'bg-green-500', text: 'text-green-700', light: 'bg-green-100' };
  if (risk < 50) return { bg: 'bg-yellow-500', text: 'text-yellow-700', light: 'bg-yellow-100' };
  if (risk < 70) return { bg: 'bg-orange-500', text: 'text-orange-700', light: 'bg-orange-100' };
  return { bg: 'bg-red-500', text: 'text-red-700', light: 'bg-red-100' };
};

const SimulatorPage = () => {
  const { riskAssessment, runSimulation, isLoading, currentSimulation } = useUserData();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<typeof mockFoodDatabase>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [simulationRun, setSimulationRun] = useState(false);
  
  // Update page title
  useEffect(() => {
    document.title = 'What-If Simulator - DiaTwin';
  }, []);
  
  // Set current simulation results when available
  useEffect(() => {
    if (currentSimulation && simulationRun) {
      setSelectedFoods(currentSimulation.foods);
    }
  }, [currentSimulation, simulationRun]);
  
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
  const handleFoodSelect = (food: typeof mockFoodDatabase[0]) => {
    const newFood: FoodItem = {
      id: uuidv4(),
      name: food.name,
      servingSize: food.servingSize,
      calories: food.calories,
      carbs: food.carbs,
      protein: food.protein,
      fat: food.fat,
      sugar: food.sugar,
      timeOfDay: 'snack' // default
    };
    
    setSelectedFoods(prev => [...prev, newFood]);
    setSearchTerm('');
    setShowSearchDropdown(false);
  };
  
  // Remove food from selection
  const removeFood = (id: string) => {
    setSelectedFoods(prev => prev.filter(food => food.id !== id));
    setSimulationRun(false);
  };
  
  // Run simulation
  const handleRunSimulation = async () => {
    await runSimulation(selectedFoods);
    setSimulationRun(true);
  };
  
  // Reset simulator
  const resetSimulator = () => {
    setSelectedFoods([]);
    setSimulationRun(false);
  };
  
  // Calculate total nutrition
  const calculateTotals = (foods: FoodItem[]) => {
    return foods.reduce(
      (totals, food) => {
        totals.calories += food.calories;
        totals.carbs += food.carbs;
        totals.sugar += food.sugar;
        return totals;
      },
      { calories: 0, carbs: 0, sugar: 0 }
    );
  };
  
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">"What-If" Food Simulator</h1>
            <p className="text-gray-600 mb-6">
              See how different food choices could impact your diabetes risk before you eat.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="order-2 lg:order-1">
                <h2 className="text-lg font-semibold mb-4">Select Foods to Simulate</h2>
                
                <div className="relative mb-6">
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
                
                {selectedFoods.length > 0 ? (
                  <div className="space-y-3 mb-6">
                    <h3 className="font-medium text-gray-700">Selected Foods:</h3>
                    {selectedFoods.map(food => (
                      <div 
                        key={food.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{food.name}</div>
                          <div className="text-sm text-gray-500">
                            {food.servingSize} • {food.calories} cal • {food.sugar}g sugar
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFood(food.id)}
                          className="text-gray-400 hover:text-red-500 transition"
                          aria-label="Remove food"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={handleRunSimulation}
                        disabled={selectedFoods.length === 0 || isLoading}
                        className={`flex-1 py-2 rounded-lg font-medium flex items-center justify-center ${
                          selectedFoods.length === 0 || isLoading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        } transition`}
                      >
                        {isLoading ? (
                          <>
                            <span className="mr-2">Simulating</span>
                            <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                          </>
                        ) : (
                          <>
                            Run Simulation
                            <ArrowRight size={16} className="ml-1" />
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={resetSimulator}
                        className="py-2 px-4 rounded-lg font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 transition"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200 mb-6">
                    <p className="text-gray-500 mb-3">
                      Search and select foods to see how they might affect your diabetes risk.
                    </p>
                    <div className="inline-flex items-center text-blue-600">
                      <Lightbulb size={16} className="mr-1" />
                      <span className="text-sm">Try searching for common foods like "pizza" or "soda"</span>
                    </div>
                  </div>
                )}
                
                {!simulationRun && selectedFoods.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-700 flex items-start">
                    <Lightbulb size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-1">Simulation Tip</p>
                      <p>
                        The simulator uses your baseline risk of {riskAssessment?.riskLevel || 35}% and adjusts it based on the 
                        nutritional content of your selected foods, especially sugar and carbohydrates.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 order-1 lg:order-2">
                <h2 className="text-lg font-semibold mb-4">Risk Simulation Results</h2>
                
                {simulationRun && currentSimulation ? (
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Diabetes Risk</span>
                        <span 
                          className={`text-sm font-bold ${
                            currentSimulation.resultingRisk > (riskAssessment?.riskLevel || 35) 
                              ? 'text-red-600' 
                              : 'text-green-600'
                          }`}
                        >
                          {currentSimulation.resultingRisk}%
                          {currentSimulation.resultingRisk > (riskAssessment?.riskLevel || 35) && (
                            <span className="ml-1 text-red-600">
                              (+{Math.round(currentSimulation.resultingRisk - (riskAssessment?.riskLevel || 35))}%)
                            </span>
                          )}
                        </span>
                      </div>
                      
                      <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getRiskColor(currentSimulation.resultingRisk).bg} transition-all duration-1000 ease-out`}
                          style={{ width: `${currentSimulation.resultingRisk}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Low Risk</span>
                        <span>High Risk</span>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${getRiskColor(currentSimulation.resultingRisk).light}`}>
                      {currentSimulation.resultingRisk > 50 ? (
                        <div className="flex items-start">
                          <AlertTriangle size={20} className="mr-2 text-red-500 flex-shrink-0" />
                          <div>
                            <p className="font-medium mb-1">High Risk Alert</p>
                            <p className="text-sm">
                              This meal significantly increases your diabetes risk. Consider healthier alternatives or smaller portions.
                            </p>
                          </div>
                        </div>
                      ) : currentSimulation.resultingRisk > (riskAssessment?.riskLevel || 35) ? (
                        <div className="flex items-start">
                          <AlertTriangle size={20} className="mr-2 text-yellow-500 flex-shrink-0" />
                          <div>
                            <p className="font-medium mb-1">Increased Risk</p>
                            <p className="text-sm">
                              This meal moderately increases your diabetes risk. Be mindful of portion sizes and balance with physical activity.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start">
                          <Check size={20} className="mr-2 text-green-500 flex-shrink-0" />
                          <div>
                            <p className="font-medium mb-1">Healthy Choice</p>
                            <p className="text-sm">
                              Great job! This meal is in line with maintaining or reducing your diabetes risk.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Nutritional Analysis</h3>
                      
                      {Object.entries(calculateTotals(currentSimulation.foods)).map(([key, value]) => {
                        const isHighValue = 
                          (key === 'calories' && value > 600) || 
                          (key === 'carbs' && value > 60) || 
                          (key === 'sugar' && value > 30);
                          
                        return (
                          <div key={key} className="mb-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm capitalize">{key}</span>
                              <span className={`text-sm font-medium ${isHighValue ? 'text-red-600' : 'text-gray-700'}`}>
                                {Math.round(value)}{key !== 'calories' ? 'g' : ''}
                                {isHighValue && ' (High)'}
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${isHighValue ? 'bg-red-500' : 'bg-blue-500'}`}
                                style={{ 
                                  width: `${
                                    key === 'calories' 
                                      ? Math.min(100, (value / 800) * 100) 
                                      : key === 'carbs' 
                                        ? Math.min(100, (value / 80) * 100)
                                        : Math.min(100, (value / 40) * 100)
                                  }%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Healthier Alternatives</h3>
                      
                      <div className="space-y-3">
                        {currentSimulation.recommendation.alternative.map((food, index) => {
                          const originalFood = currentSimulation.foods[index];
                          
                          return (
                            <div key={food.id} className="flex items-start p-3 bg-white rounded-lg shadow-sm">
                              <div className="mr-3 flex-1">
                                <div className="font-medium text-green-600">{food.name}</div>
                                <div className="text-sm text-gray-500">
                                  {food.calories} cal (-{originalFood.calories - food.calories})
                                </div>
                              </div>
                              <ArrowRight size={16} className="mx-2 text-gray-400 flex-shrink-0 mt-2" />
                              <div className="flex-1">
                                <div className="font-medium line-through text-gray-400">{originalFood.name}</div>
                                <div className="text-sm text-gray-500">{originalFood.calories} cal</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-lg border border-green-200">
                        <div className="flex items-center">
                          <div className="mr-3 p-2 bg-green-100 rounded-full">
                            <RefreshCw size={16} className="text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Risk Reduction Potential</p>
                            <p className="text-sm">
                              Making these swaps could reduce your risk by approximately {currentSimulation.recommendation.riskReduction}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Lightbulb size={24} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Run a Simulation</h3>
                    <p className="text-gray-500 max-w-xs">
                      Select foods on the left and run the simulation to see how they might affect your diabetes risk.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatorPage;