import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const foodOptions = [
  { id: 1, name: 'Cheeseburger', calories: 550, sugar: 9, carbs: 40, impact: 25 },
  { id: 2, name: 'Pizza Slice', calories: 285, sugar: 3.8, carbs: 36, impact: 18 },
  { id: 3, name: 'Soda (12oz)', calories: 150, sugar: 39, carbs: 39, impact: 30 },
  { id: 4, name: 'Grilled Chicken Salad', calories: 320, sugar: 4, carbs: 10, impact: -5 },
  { id: 5, name: 'Yogurt with Berries', calories: 180, sugar: 15, carbs: 23, impact: 3 }
];

const RiskSimulatorDemo = () => {
  const [selectedFoods, setSelectedFoods] = useState<typeof foodOptions>([]);
  const [baseRisk, setBaseRisk] = useState(35);
  const [currentRisk, setCurrentRisk] = useState(baseRisk);
  const [chartWidth, setChartWidth] = useState(baseRisk);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const handleFoodSelect = (food: typeof foodOptions[0]) => {
    if (selectedFoods.some(f => f.id === food.id)) {
      setSelectedFoods(selectedFoods.filter(f => f.id !== food.id));
    } else {
      setSelectedFoods([...selectedFoods, food]);
    }
  };
  
  const runSimulation = () => {
    setIsSimulating(true);
    
    // Reset to base risk
    setCurrentRisk(baseRisk);
    setChartWidth(baseRisk);
    
    // Simulate calculation with animation
    setTimeout(() => {
      let riskImpact = selectedFoods.reduce((total, food) => total + food.impact, 0);
      let newRisk = Math.min(100, Math.max(0, baseRisk + riskImpact));
      
      // Animate the risk meter
      const startValue = baseRisk;
      const endValue = newRisk;
      const duration = 1500;
      const increment = 20;
      const steps = duration / increment;
      const stepValue = (endValue - startValue) / steps;
      
      let currentStep = 0;
      
      const timer = setInterval(() => {
        currentStep++;
        
        if (currentStep >= steps) {
          clearInterval(timer);
          setCurrentRisk(endValue);
          setChartWidth(endValue);
          setIsSimulating(false);
          setShowResults(true);
        } else {
          const nextValue = startValue + stepValue * currentStep;
          setCurrentRisk(Math.round(nextValue));
          setChartWidth(nextValue);
        }
      }, increment);
    }, 500);
  };
  
  const resetSimulation = () => {
    setSelectedFoods([]);
    setCurrentRisk(baseRisk);
    setChartWidth(baseRisk);
    setShowResults(false);
  };
  
  // Get risk color based on value
  const getRiskColor = (risk: number) => {
    if (risk < 30) return 'bg-green-500';
    if (risk < 50) return 'bg-yellow-500';
    if (risk < 70) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-600 mb-4">
            Interactive Demo
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Try Our Risk Simulator</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See how different food choices can impact your diabetes risk in real-time.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 md:p-8 bg-gray-50">
              <h3 className="font-semibold text-lg mb-4">Select Your Meal</h3>
              
              <div className="space-y-3 mb-6">
                {foodOptions.map(food => (
                  <div 
                    key={food.id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedFoods.some(f => f.id === food.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleFoodSelect(food)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{food.name}</span>
                      <span className="text-sm text-gray-500">{food.calories} cal</span>
                    </div>
                    <div className="flex space-x-3 mt-1 text-xs text-gray-500">
                      <span>Carbs: {food.carbs}g</span>
                      <span>Sugar: {food.sugar}g</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={runSimulation}
                disabled={selectedFoods.length === 0 || isSimulating}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center ${
                  selectedFoods.length === 0 || isSimulating
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition`}
              >
                {isSimulating ? (
                  <>
                    <span className="mr-2">Simulating</span>
                    <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  </>
                ) : (
                  <>
                    Run Simulation
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </button>
              
              {showResults && (
                <button 
                  onClick={resetSimulation}
                  className="w-full py-2 rounded-lg font-medium text-blue-600 hover:text-blue-700 mt-3 border border-blue-600 hover:border-blue-700 transition"
                >
                  Reset
                </button>
              )}
            </div>
            
            <div className="p-6 md:p-8 border-t md:border-t-0 md:border-l border-gray-200">
              <h3 className="font-semibold text-lg mb-4">Your Risk Assessment</h3>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Diabetes Risk</span>
                  <span className="text-sm font-bold">{currentRisk}%</span>
                </div>
                
                <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getRiskColor(currentRisk)} transition-all duration-1000 ease-out`}
                    style={{ width: `${chartWidth}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low Risk</span>
                  <span>High Risk</span>
                </div>
              </div>
              
              <div 
                className={`transition-opacity duration-500 ${
                  showResults ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {showResults && (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                      <h4 className="font-medium mb-2">Analysis</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {currentRisk > baseRisk
                          ? `Your meal choices have increased your diabetes risk by ${currentRisk - baseRisk}%.`
                          : currentRisk < baseRisk
                          ? `Your healthy choices have decreased your diabetes risk by ${baseRisk - currentRisk}%.`
                          : 'Your meal choices have not affected your diabetes risk.'}
                      </p>
                      
                      <div className="space-y-2">
                        {selectedFoods.map(food => (
                          <div key={food.id} className="flex justify-between text-sm">
                            <span>{food.name}</span>
                            <span className={food.impact > 0 ? 'text-red-500' : 'text-green-500'}>
                              {food.impact > 0 ? `+${food.impact}%` : `${food.impact}%`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Recommendations</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {selectedFoods.some(f => f.id === 3) && (
                          <li className="flex items-start">
                            <span className="h-5 w-5 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">!</span>
                            <span>Replace soda with water or unsweetened tea to reduce sugar intake.</span>
                          </li>
                        )}
                        
                        {selectedFoods.some(f => f.id === 1) && (
                          <li className="flex items-start">
                            <span className="h-5 w-5 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">!</span>
                            <span>Consider a grilled chicken sandwich instead of a cheeseburger.</span>
                          </li>
                        )}
                        
                        {selectedFoods.some(f => f.id === 2) && (
                          <li className="flex items-start">
                            <span className="h-5 w-5 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">!</span>
                            <span>Add a side salad to balance your pizza with more fiber.</span>
                          </li>
                        )}
                        
                        {!selectedFoods.some(f => [1, 2, 3].includes(f.id)) && (
                          <li className="flex items-start">
                            <span className="h-5 w-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                            <span>Great choices! Your meal selections help maintain a healthy diabetes risk level.</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RiskSimulatorDemo;