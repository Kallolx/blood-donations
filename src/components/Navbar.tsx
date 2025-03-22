import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Activity, Users, AlertCircle, Menu, X, Hospital, LogOut, Droplet, LayoutDashboard } from 'lucide-react';
import { logout, isAuthenticated, getCurrentUser } from '@/utils/authService';
import { supabase } from '@/utils/supabaseClient';

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [donorCount, setDonorCount] = useState(1234); // Mock data
  const [emergencyRequests, setEmergencyRequests] = useState(8); // Mock data

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      const { role } = await getCurrentUser();
      setIsAuth(auth);
      setUserRole(role);
    };
    
    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuth(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsAuth(false);
    setUserRole(null);
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b border-blood-100/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
             <img src="/logo.svg" alt="logo" className="h-6 w-6" />
              <span className="ml-2 text-xl font-semibold font-poppins uppercase text-gray-900">BloodLink</span>
            </Link>
          </div>

          {/* Center navigation - only shown when authenticated */}
          {isAuth && (
            <div className="hidden md:flex items-center justify-center flex-1 mx-10">
              <div className="flex space-x-6">
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-blood-600 flex items-center space-x-1 px-3 py-2 rounded-md font-medium transition-colors"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/donate" 
                  className="text-gray-700 hover:text-blood-600 flex items-center space-x-1 px-3 py-2 rounded-md font-medium transition-colors"
                >
                  <Droplet className="h-5 w-5" />
                  <span>Donate</span>
                </Link>
                <Link 
                  to="/hospitals" 
                  className="text-gray-700 hover:text-blood-600 flex items-center space-x-1 px-3 py-2 rounded-md font-medium transition-colors"
                >
                  <Hospital className="h-5 w-5" />
                  <span>Hospitals</span>
                </Link>
              </div>
            </div>
          )}

          {/* Right side - auth buttons */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {isAuth ? (
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-blood-600 flex items-center space-x-1"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-blood-600"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="bg-blood-600 text-white hover:bg-blood-700"
                    onClick={() => navigate('/signup')}
                  >
                    Create Account
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blood-600 focus:outline-none"
              aria-expanded="false"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-blood-100/20 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuth && (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blood-600 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/donate"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blood-600 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Droplet className="h-5 w-5" />
                  <span>Donate</span>
                </Link>
                <Link
                  to="/hospitals"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blood-600 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Hospital className="h-5 w-5" />
                  <span>Hospitals</span>
                </Link>
                <div className="border-t border-gray-200 my-2"></div>
              </>
            )}
            
            {isAuth ? (
              <button
                className="w-full text-left flex items-center space-x-2 text-gray-700 hover:text-blood-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-blood-600 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block text-gray-700 hover:text-blood-600 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
