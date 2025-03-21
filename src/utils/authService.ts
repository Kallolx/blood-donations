
import { SignUpData, LoginData, UserRole, Donor, Hospital } from './types';
import { supabase } from './supabaseClient';
import { toast } from 'sonner';

// Authentication functions
export const signUp = async (data: SignUpData): Promise<boolean> => {
  try {
    // First, create the auth user
    const { error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    
    if (authError) {
      toast.error(authError.message);
      return false;
    }
    
    // Then create the profile in the respective table
    if (data.role === 'donor') {
      const { error: donorError } = await supabase
        .from('donor_info')
        .insert({
          email: data.email,
          name: data.name,
          bloodGroup: data.bloodGroup,
          age: data.age,
          phoneNumber: data.phoneNumber,
        });
      
      if (donorError) {
        toast.error(donorError.message);
        return false;
      }
    } else if (data.role === 'hospital') {
      const { error: hospitalError } = await supabase
        .from('hospital_info')
        .insert({
          email: data.email,
          name: data.name,
          address: data.address,
          bloodGroup: data.bloodGroup,
          quantity: data.quantity,
          urgency: data.urgency,
        });
      
      if (hospitalError) {
        toast.error(hospitalError.message);
        return false;
      }
    }
    
    // Save user role to localStorage
    localStorage.setItem('userRole', data.role);
    
    toast.success('Account created successfully! Please check your email to verify your account.');
    return true;
  } catch (error) {
    console.error('Signup error:', error);
    toast.error('Failed to create account. Please try again.');
    return false;
  }
};

export const login = async (data: LoginData): Promise<boolean> => {
  try {
    // Sign in with Supabase auth
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    
    if (authError) {
      toast.error(authError.message);
      return false;
    }
    
    // Verify the user exists in the respective table
    if (data.role === 'donor') {
      const { data: donorData, error: donorError } = await supabase
        .from('donor_info')
        .select('*')
        .eq('email', data.email)
        .single();
      
      if (donorError || !donorData) {
        toast.error('User not found in donor database');
        await supabase.auth.signOut();
        return false;
      }
    } else if (data.role === 'hospital') {
      const { data: hospitalData, error: hospitalError } = await supabase
        .from('hospital_info')
        .select('*')
        .eq('email', data.email)
        .single();
      
      if (hospitalError || !hospitalData) {
        toast.error('User not found in hospital database');
        await supabase.auth.signOut();
        return false;
      }
    }
    
    // Save user role to localStorage
    localStorage.setItem('userRole', data.role);
    
    toast.success('Logged in successfully!');
    return true;
  } catch (error) {
    console.error('Login error:', error);
    toast.error('Failed to login. Please try again.');
    return false;
  }
};

export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
  localStorage.removeItem('userRole');
  toast.success('Logged out successfully');
};

export const getCurrentUser = async (): Promise<{ role: UserRole | null, email: string | null }> => {
  const { data } = await supabase.auth.getSession();
  const email = data.session?.user?.email || null;
  const role = localStorage.getItem('userRole') as UserRole | null;
  
  return { role, email };
};

export const isAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

export const getDonorData = async (email: string): Promise<Donor | null> => {
  const { data, error } = await supabase
    .from('donor_info')
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
    .from('hospital_info')
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
    .from('donor_info')
    .select('*');
  
  if (error || !data) {
    return [];
  }
  
  return data as Donor[];
};

export const getAllHospitals = async (): Promise<Hospital[]> => {
  const { data, error } = await supabase
    .from('hospital_info')
    .select('*');
  
  if (error || !data) {
    return [];
  }
  
  return data as Hospital[];
};
