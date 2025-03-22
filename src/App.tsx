import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Donate from "./pages/Donate";
import Hospitals from "./pages/Hospitals";
import { isAuthenticated } from "./utils/authService";
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface AuthRouteProps {
  unauthenticated: React.ReactNode;
  authenticated: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      setIsAuth(auth);
    };
    checkAuth();
  }, []);

  if (isAuth === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blood-600" />
      </div>
    );
  }

  return isAuth ? <>{children}</> : <Navigate to="/login" />;
};

// Route that shows different components based on auth status
const AuthRoute = ({ unauthenticated, authenticated }: AuthRouteProps) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      setIsAuth(auth);
    };
    checkAuth();
  }, []);

  if (isAuth === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blood-600" />
      </div>
    );
  }

  return isAuth ? <>{authenticated}</> : <>{unauthenticated}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <AuthRoute 
                      unauthenticated={<Homepage />} 
                      authenticated={<Dashboard />} 
                    />
                  } 
                />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/donate"
                  element={
                    <ProtectedRoute>
                      <Donate />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hospitals"
                  element={
                    <ProtectedRoute>
                      <Hospitals />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
