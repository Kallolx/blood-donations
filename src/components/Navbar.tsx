
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Droplet } from 'lucide-react';
import { logout, isAuthenticated, getCurrentUser } from '@/utils/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const { role } = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105"
            >
              <Droplet className="h-6 w-6 text-blood-500" />
              <span className="text-xl font-semibold bg-gradient-to-r from-blood-600 to-blood-500 bg-clip-text text-transparent">BloodLink</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blood-600 transition-colors duration-300"
            >
              Home
            </Link>
            
            {authenticated && role === 'donor' && (
              <Link 
                to="/donor-dashboard" 
                className="text-gray-700 hover:text-blood-600 transition-colors duration-300"
              >
                Dashboard
              </Link>
            )}
            
            {authenticated && role === 'hospital' && (
              <Link 
                to="/hospital-dashboard" 
                className="text-gray-700 hover:text-blood-600 transition-colors duration-300"
              >
                Dashboard
              </Link>
            )}
          </nav>
          
          <div className="flex items-center space-x-3">
            {authenticated ? (
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-blood-200 text-blood-600 hover:bg-blood-50 transition-all duration-300"
              >
                Log Out
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                  className="text-gray-700 hover:text-blood-600 hover:bg-blood-50 transition-all duration-300"
                >
                  Log In
                </Button>
                <Button 
                  onClick={() => navigate('/signup')}
                  className="bg-blood-500 hover:bg-blood-600 text-white transition-all duration-300"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
