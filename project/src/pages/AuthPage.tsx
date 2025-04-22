import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/auth/AuthForm';
import { Activity } from 'lucide-react';

const AuthPage = () => {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (currentUser && !isLoading) {
      navigate('/dashboard');
    }
  }, [currentUser, isLoading, navigate]);
  
  // Update page title
  useEffect(() => {
    document.title = 'Sign In - DiaTwin';
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="hidden md:flex flex-col justify-center p-8 bg-blue-600 rounded-xl text-white">
            <div className="mx-auto mb-6">
              <Activity size={48} />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-center">Welcome to DiaTwin</h1>
            <p className="mb-6 text-blue-100">
              Your personal digital twin for diabetes prevention and management. We use AI to help you understand your risk and make healthier choices.
            </p>
            
            <div className="space-y-4">
              <div className="bg-blue-500 bg-opacity-30 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Personalized Risk Assessment</h3>
                <p className="text-sm text-blue-100">Get detailed insights about your diabetes risk based on your health profile.</p>
              </div>
              
              <div className="bg-blue-500 bg-opacity-30 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Daily Food Tracking</h3>
                <p className="text-sm text-blue-100">Log your meals and see how they affect your health in real-time.</p>
              </div>
              
              <div className="bg-blue-500 bg-opacity-30 p-4 rounded-lg">
                <h3 className="font-medium mb-2">"What-If" Simulations</h3>
                <p className="text-sm text-blue-100">Test how different food choices might impact your diabetes risk before you eat.</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col justify-center">
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;