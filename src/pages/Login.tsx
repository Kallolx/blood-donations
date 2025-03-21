
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import Navbar from '@/components/Navbar';
import { isAuthenticated } from '@/utils/authService';

const Login = () => {
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <div className="flex-1 flex flex-col justify-center items-center p-4 pt-20">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blood-700 to-blood-500 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <AuthForm type="login" />
        </div>
      </div>
    </div>
  );
};

export default Login;
