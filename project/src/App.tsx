import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { UserDataProvider } from './contexts/UserDataContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import DailyTrackingPage from './pages/DailyTrackingPage';
import SimulatorPage from './pages/SimulatorPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserDataProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route 
                  path="/profile-setup" 
                  element={
                    <ProtectedRoute>
                      <ProfileSetupPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/daily-tracking" 
                  element={
                    <ProtectedRoute>
                      <DailyTrackingPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/simulator" 
                  element={
                    <ProtectedRoute>
                      <SimulatorPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
            <Toaster position="top-center" />
          </div>
        </UserDataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;