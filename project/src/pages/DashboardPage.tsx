import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserData } from '../contexts/UserDataContext';
import { 
  ArrowDown, ArrowUp, Activity, CalendarRange, TrendingUp, Utensils,
  Clock, Dumbbell, PieChart, BarChart3
} from 'lucide-react';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { riskAssessment, dailyEntries } = useUserData();
  
  // Update page title
  useEffect(() => {
    document.title = 'Dashboard - DiaTwin';
  }, []);
  
  // Get risk color based on value
  const getRiskColor = (risk: number) => {
    if (risk < 30) return { color: 'text-green-600', bg: 'bg-green-500', light: 'bg-green-100' };
    if (risk < 50) return { color: 'text-yellow-600', bg: 'bg-yellow-500', light: 'bg-yellow-100' };
    if (risk < 70) return { color: 'text-orange-600', bg: 'bg-orange-500', light: 'bg-orange-100' };
    return { color: 'text-red-600', bg: 'bg-red-500', light: 'bg-red-100' };
  };
  
  // Calculate risk trend
  const calculateRiskTrend = () => {
    if (dailyEntries.length < 2) return { value: 0, direction: 'stable' };
    
    const sortedEntries = [...dailyEntries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    if (sortedEntries.length >= 2) {
      const latest = sortedEntries[0].riskLevel;
      const previous = sortedEntries[1].riskLevel;
      const diff = latest - previous;
      
      return {
        value: Math.abs(diff),
        direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable'
      };
    }
    
    return { value: 0, direction: 'stable' };
  };
  
  const riskTrend = calculateRiskTrend();
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Get last 7 days entries for chart
  const getLast7DaysEntries = () => {
    const sortedEntries = [...dailyEntries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    return sortedEntries.slice(-7);
  };
  
  const last7DaysEntries = getLast7DaysEntries();
  
  // Calculate average daily risk
  const calculateAverageRisk = () => {
    if (dailyEntries.length === 0) return riskAssessment?.riskLevel || 0;
    
    const total = dailyEntries.reduce((sum, entry) => sum + entry.riskLevel, 0);
    return Math.round(total / dailyEntries.length);
  };
  
  const averageRisk = calculateAverageRisk();
  
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Your Health Dashboard
            </h1>
            <p className="text-gray-600">
              {currentUser?.name ? `Welcome back, ${currentUser.name}` : 'Welcome back'}. Here's your health overview.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-500">Last updated:</span>
            <span className="text-sm font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Current Risk Status</h2>
              <div className="p-2 bg-blue-100 rounded-full">
                <Activity size={20} className="text-blue-600" />
              </div>
            </div>
            
            <div className="flex items-end">
              <div className="mr-3">
                <span className={`text-3xl font-bold ${getRiskColor(riskAssessment?.riskLevel || 0).color}`}>
                  {riskAssessment?.riskLevel || 0}%
                </span>
                <div className="mt-1 flex items-center">
                  <span className={`text-sm font-medium rounded-full px-2 py-0.5 ${getRiskColor(riskAssessment?.riskLevel || 0).light}`}>
                    {riskAssessment?.status || 'Loading...'}
                  </span>
                </div>
              </div>
              
              {riskTrend.value > 0 && (
                <div className={`flex items-center text-sm ${
                  riskTrend.direction === 'up' ? 'text-red-500' : 'text-green-500'
                }`}>
                  {riskTrend.direction === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  <span className="ml-1">{riskTrend.value}%</span>
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getRiskColor(riskAssessment?.riskLevel || 0).bg}`}
                  style={{ width: `${riskAssessment?.riskLevel || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Daily Tracking</h2>
              <div className="p-2 bg-purple-100 rounded-full">
                <CalendarRange size={20} className="text-purple-600" />
              </div>
            </div>
            
            <div>
              <span className="text-3xl font-bold">
                {dailyEntries.length}
              </span>
              <span className="text-gray-500 ml-2">days tracked</span>
            </div>
            
            <div className="mt-4 grid grid-cols-7 gap-1">
              {Array.from({ length: 28 }).map((_, index) => {
                const hasEntry = dailyEntries.some(entry => {
                  const entryDate = new Date(entry.date);
                  const today = new Date();
                  const diff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
                  return diff === 27 - index;
                });
                
                return (
                  <div 
                    key={index}
                    className={`w-full aspect-square rounded-sm ${
                      hasEntry ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  ></div>
                );
              })}
            </div>
            
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>4 weeks ago</span>
              <span>Today</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Key Risk Factors</h2>
              <div className="p-2 bg-teal-100 rounded-full">
                <TrendingUp size={20} className="text-teal-600" />
              </div>
            </div>
            
            <div className="space-y-3">
              {riskAssessment?.keyFactors?.map((factor, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{factor.factor}</span>
                    <span className={`text-sm font-medium ${factor.impact > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {factor.impact > 0 ? `+${factor.impact}%` : `${factor.impact}%`}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${factor.impact > 0 ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.abs(factor.impact)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Risk Trend (Last 7 Days)</h2>
              <div className="flex space-x-2">
                <div className="p-1 px-2 rounded text-xs font-medium bg-blue-100 text-blue-600">7D</div>
                <div className="p-1 px-2 rounded text-xs font-medium bg-gray-100 text-gray-600">14D</div>
                <div className="p-1 px-2 rounded text-xs font-medium bg-gray-100 text-gray-600">30D</div>
              </div>
            </div>
            
            <div className="h-64">
              {last7DaysEntries.length === 0 ? (
                <div className="h-full flex items-center justify-center flex-col">
                  <div className="p-3 bg-gray-100 rounded-full mb-3">
                    <Activity size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500">Start tracking daily to see your risk trend</p>
                </div>
              ) : (
                <div className="h-full flex items-end space-x-2">
                  {last7DaysEntries.map((entry, index) => {
                    const heightPercentage = Math.max(5, (entry.riskLevel / 100) * 100);
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className={`w-full rounded-t-sm ${getRiskColor(entry.riskLevel).bg}`}
                          style={{ height: `${heightPercentage}%` }}
                        ></div>
                        <div className="text-xs text-gray-500 mt-2 truncate w-full text-center">
                          {formatDate(entry.date)}
                        </div>
                      </div>
                    );
                  })}
                  
                  {last7DaysEntries.length < 7 && Array.from({ length: 7 - last7DaysEntries.length }).map((_, index) => (
                    <div key={`empty-${index}`} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full rounded-t-sm bg-gray-200"
                        style={{ height: '5%' }}
                      ></div>
                      <div className="text-xs text-gray-300 mt-2 truncate w-full text-center">
                        No data
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Health Stats</h2>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-md mr-3">
                  <Activity size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Average Risk</div>
                  <div className="font-bold">{averageRisk}%</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-md mr-3">
                  <Utensils size={20} className="text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Meals Tracked</div>
                  <div className="font-bold">
                    {dailyEntries.reduce((total, entry) => total + entry.meals.length, 0)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-md mr-3">
                  <Clock size={20} className="text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Streak</div>
                  <div className="font-bold">
                    {(() => {
                      let streak = 0;
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      
                      for (let i = 0; i < 30; i++) {
                        const date = new Date(today);
                        date.setDate(today.getDate() - i);
                        const dateString = date.toISOString().split('T')[0];
                        
                        if (dailyEntries.some(entry => entry.date === dateString)) {
                          streak++;
                        } else {
                          break;
                        }
                      }
                      
                      return streak;
                    })()}
                    <span className="ml-1 text-sm text-gray-500">days</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-md mr-3">
                  <Dumbbell size={20} className="text-orange-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Activity Level</div>
                  <div className="font-bold">
                    Medium
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recommendations</h2>
              <div className="p-2 bg-yellow-100 rounded-full">
                <Lightbulb size={20} className="text-yellow-600" />
              </div>
            </div>
            
            <div className="space-y-4">
              {(riskAssessment?.suggestions || []).map((suggestion, index) => (
                <div key={index} className="flex items-start">
                  <div className="p-1 bg-green-100 rounded-full mr-2 mt-0.5">
                    <Check size={14} className="text-green-600" />
                  </div>
                  <span className="text-gray-700">{suggestion}</span>
                </div>
              ))}
              
              {(riskAssessment?.suggestions || []).length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500">Complete your profile to receive personalized recommendations</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Nutrition Overview</h2>
              <div className="flex space-x-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <PieChart size={20} className="text-red-600" />
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <BarChart3 size={20} className="text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {['Calories', 'Carbs', 'Sugar'].map((nutrient, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">{nutrient}</div>
                  <div className="font-bold">
                    {dailyEntries.length > 0 ? (
                      <>
                        {Math.round(
                          dailyEntries.reduce((total, entry) => {
                            return total + entry.meals.reduce((mealTotal, meal) => {
                              if (nutrient === 'Calories') return mealTotal + meal.calories;
                              if (nutrient === 'Carbs') return mealTotal + meal.carbs;
                              return mealTotal + meal.sugar;
                            }, 0);
                          }, 0) / Math.max(1, dailyEntries.length)
                        )}
                        <span className="text-xs text-gray-500 ml-1">
                          {nutrient === 'Calories' ? '' : 'g'}/day
                        </span>
                      </>
                    ) : (
                      'No data'
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Most Consumed Foods</h3>
              
              {dailyEntries.length > 0 ? (
                <div>
                  {(() => {
                    const foodCounts: Record<string, number> = {};
                    
                    dailyEntries.forEach(entry => {
                      entry.meals.forEach(meal => {
                        foodCounts[meal.name] = (foodCounts[meal.name] || 0) + 1;
                      });
                    });
                    
                    return Object.entries(foodCounts)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3)
                      .map(([name, count], index) => (
                        <div key={index} className="flex justify-between items-center mb-2">
                          <span className="text-gray-700">{name}</span>
                          <div className="flex items-center">
                            <div 
                              className="h-2 bg-blue-500 rounded-full mr-2"
                              style={{ width: `${Math.min(100, count * 10)}px` }}
                            ></div>
                            <span className="text-sm text-gray-500">{count}x</span>
                          </div>
                        </div>
                      ));
                  })()}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">Track meals to see your nutrition patterns</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;