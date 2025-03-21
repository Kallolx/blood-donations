
import { AuthData, SignUpData, LoginData, UserRole, Donor, Hospital } from './types';
import { toast } from 'sonner';

// Mock data for demonstration purposes
// In a real app, this would be replaced with Supabase API calls
const mockDonors: Record<string, { password: string } & Donor> = {
  'donor@example.com': {
    email: 'donor@example.com',
    password: 'password123',
    name: 'John Donor',
    bloodGroup: 'A+',
    age: 28,
    phoneNumber: '555-1234',
  },
};

const mockHospitals: Record<string, { password: string } & Hospital> = {
  'hospital@example.com': {
    email: 'hospital@example.com',
    password: 'password123',
    name: 'City General Hospital',
    address: '123 Medical Drive, Healthcare City',
    bloodGroup: 'O-',
    quantity: 1500,
    urgency: 'High',
  },
};

// Mock database of donors and hospitals
const mockDonorList: Donor[] = [
  {
    email: 'donor1@example.com',
    name: 'John Smith',
    bloodGroup: 'A+',
    age: 28,
    phoneNumber: '555-1234',
  },
  {
    email: 'donor2@example.com',
    name: 'Sarah Johnson',
    bloodGroup: 'O-',
    age: 35,
    phoneNumber: '555-5678',
  },
  {
    email: 'donor3@example.com',
    name: 'Michael Brown',
    bloodGroup: 'B+',
    age: 42,
    phoneNumber: '555-9012',
  },
  {
    email: 'donor4@example.com',
    name: 'Emily Davis',
    bloodGroup: 'AB+',
    age: 31,
    phoneNumber: '555-3456',
  },
  {
    email: 'donor5@example.com',
    name: 'Daniel Wilson',
    bloodGroup: 'A-',
    age: 25,
    phoneNumber: '555-7890',
  },
];

const mockHospitalList: Hospital[] = [
  {
    email: 'hospital1@example.com',
    name: 'City General Hospital',
    address: '123 Medical Drive, Healthcare City',
    bloodGroup: 'O-',
    quantity: 1500,
    urgency: 'High',
  },
  {
    email: 'hospital2@example.com',
    name: 'Memorial Medical Center',
    address: '456 Health Avenue, Wellness Town',
    bloodGroup: 'A+',
    quantity: 1000,
    urgency: 'Medium',
  },
  {
    email: 'hospital3@example.com',
    name: 'Community Hospital',
    address: '789 Care Street, Healing Village',
    bloodGroup: 'B+',
    quantity: 800,
    urgency: 'Low',
  },
  {
    email: 'hospital4@example.com',
    name: 'University Medical Center',
    address: '321 Research Blvd, Academia City',
    bloodGroup: 'AB+',
    quantity: 1200,
    urgency: 'Medium',
  },
  {
    email: 'hospital5@example.com',
    name: "Children's Hospital",
    address: '654 Pediatric Lane, Careville',
    bloodGroup: 'O+',
    quantity: 500,
    urgency: 'High',
  },
];

// Authentication functions
export const signUp = async (data: SignUpData): Promise<boolean> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (data.role === 'donor') {
      // Check if donor already exists
      if (mockDonors[data.email]) {
        toast.error('A donor with this email already exists');
        return false;
      }
      
      // Add to mock database
      mockDonors[data.email] = {
        email: data.email,
        password: data.password,
        name: data.name,
        bloodGroup: data.bloodGroup,
        age: data.age,
        phoneNumber: data.phoneNumber,
      };
      
      // Add to list
      mockDonorList.push({
        email: data.email,
        name: data.name,
        bloodGroup: data.bloodGroup,
        age: data.age,
        phoneNumber: data.phoneNumber,
      });
      
    } else if (data.role === 'hospital') {
      // Check if hospital already exists
      if (mockHospitals[data.email]) {
        toast.error('A hospital with this email already exists');
        return false;
      }
      
      // Add to mock database
      mockHospitals[data.email] = {
        email: data.email,
        password: data.password,
        name: data.name,
        address: data.address,
        bloodGroup: data.bloodGroup,
        quantity: data.quantity,
        urgency: data.urgency,
      };
      
      // Add to list
      mockHospitalList.push({
        email: data.email,
        name: data.name,
        address: data.address,
        bloodGroup: data.bloodGroup,
        quantity: data.quantity,
        urgency: data.urgency,
      });
    }
    
    // Save user role and email to localStorage
    localStorage.setItem('userRole', data.role);
    localStorage.setItem('userEmail', data.email);
    
    toast.success('Account created successfully!');
    return true;
  } catch (error) {
    console.error('Signup error:', error);
    toast.error('Failed to create account. Please try again.');
    return false;
  }
};

export const login = async (data: LoginData): Promise<boolean> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (data.role === 'donor') {
      const donor = mockDonors[data.email];
      if (!donor || donor.password !== data.password) {
        toast.error('Invalid email or password');
        return false;
      }
    } else if (data.role === 'hospital') {
      const hospital = mockHospitals[data.email];
      if (!hospital || hospital.password !== data.password) {
        toast.error('Invalid email or password');
        return false;
      }
    }
    
    // Save user role and email to localStorage
    localStorage.setItem('userRole', data.role);
    localStorage.setItem('userEmail', data.email);
    
    toast.success('Logged in successfully!');
    return true;
  } catch (error) {
    console.error('Login error:', error);
    toast.error('Failed to login. Please try again.');
    return false;
  }
};

export const logout = (): void => {
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
  toast.success('Logged out successfully');
};

export const getCurrentUser = (): { role: UserRole | null, email: string | null } => {
  const role = localStorage.getItem('userRole') as UserRole | null;
  const email = localStorage.getItem('userEmail');
  return { role, email };
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('userRole');
};

export const getDonorData = (email: string): Donor | null => {
  if (mockDonors[email]) {
    const { password, ...donorData } = mockDonors[email];
    return donorData;
  }
  return null;
};

export const getHospitalData = (email: string): Hospital | null => {
  if (mockHospitals[email]) {
    const { password, ...hospitalData } = mockHospitals[email];
    return hospitalData;
  }
  return null;
};

export const getAllDonors = (): Donor[] => {
  return mockDonorList;
};

export const getAllHospitals = (): Hospital[] => {
  return mockHospitalList;
};
