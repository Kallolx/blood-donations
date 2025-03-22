import { SignUpData, LoginData, UserRole, Donor, Hospital } from './types';
import { supabase } from './supabaseClient';
import { toast } from 'sonner';

interface AuthData {
  email: string;
  password: string;
  role: UserRole;
}

// Authentication functions
export const signUp = async (data: AuthData): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          role: data.role
        }
      }
    });

    if (error) throw error;

    toast.success('Account created! Please check your email to verify your account.');
    return true;
  } catch (error: any) {
    console.error('Signup error:', error);
    toast.error(error.message || 'Failed to create account');
    return false;
  }
};

export const login = async (data: AuthData): Promise<boolean> => {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;

    // Store the role in localStorage
    if (authData?.user) {
      localStorage.setItem('userRole', data.role);
    }

    toast.success('Welcome back!');
    return true;
  } catch (error: any) {
    console.error('Login error:', error);
    toast.error(error.message || 'Failed to login');
    return false;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Remove role from localStorage
    localStorage.removeItem('userRole');
    
    toast.success('Logged out successfully');
  } catch (error: any) {
    console.error('Logout error:', error);
    toast.error(error.message || 'Failed to logout');
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};

export const getUserRole = (): UserRole | null => {
  const role = localStorage.getItem('userRole') as UserRole;
  return role || null;
};

export const getDonorData = async (email: string): Promise<Donor | null> => {
  const { data, error } = await supabase
    .from('blood_donations')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data as Donor;
};

export const getHospitalData = async (email: string): Promise<Hospital | null> => {
  const { data, error } = await supabase
    .from('blood_requests')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data as Hospital;
};

export const getAllDonors = async (): Promise<Donor[]> => {
  const { data, error } = await supabase
    .from('blood_donations')
    .select('*');
  
  if (error || !data) {
    return [];
  }
  
  return data as Donor[];
};

export const getAllHospitals = async (): Promise<Hospital[]> => {
  const { data, error } = await supabase
    .from('blood_requests')
    .select('*');
  
  if (error || !data) {
    return [];
  }
  
  return data as Hospital[];
};

// Add a function to handle auth state changes
export const setupAuthListener = (navigate: (path: string) => void) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN') {
      const role = localStorage.getItem('userRole') as UserRole;
      if (role) {
        navigate('/');
      }
    } else if (event === 'SIGNED_OUT') {
      navigate('/');
    }
  });
};
