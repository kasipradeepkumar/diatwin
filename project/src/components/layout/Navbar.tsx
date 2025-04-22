import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Update scroll state on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || currentUser || location.pathname !== '/' 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Activity size={28} className="text-blue-600" />
          <span className="text-xl font-bold text-blue-600">DiaTwin</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`font-medium transition hover:text-blue-600 ${
              location.pathname === '/' ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            Home
          </Link>
          
          {currentUser ? (
            <>
              <Link 
                to="/dashboard" 
                className={`font-medium transition hover:text-blue-600 ${
                  location.pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/daily-tracking" 
                className={`font-medium transition hover:text-blue-600 ${
                  location.pathname === '/daily-tracking' ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                Track
              </Link>
              <Link 
                to="/simulator" 
                className={`font-medium transition hover:text-blue-600 ${
                  location.pathname === '/simulator' ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                Simulator
              </Link>
              <button 
                onClick={handleSignOut}
                className="font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link 
              to="/auth" 
              className="px-4 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Sign In
            </Link>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-4 px-4 absolute w-full">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`font-medium px-4 py-2 rounded transition ${
                location.pathname === '/' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            
            {currentUser ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`font-medium px-4 py-2 rounded transition ${
                    location.pathname === '/dashboard' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/daily-tracking" 
                  className={`font-medium px-4 py-2 rounded transition ${
                    location.pathname === '/daily-tracking' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Track
                </Link>
                <Link 
                  to="/simulator" 
                  className={`font-medium px-4 py-2 rounded transition ${
                    location.pathname === '/simulator' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Simulator
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="font-medium px-4 py-2 rounded text-gray-700 hover:bg-gray-100 text-left transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition text-center"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;