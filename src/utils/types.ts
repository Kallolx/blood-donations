export type UserRole = 'donor' | 'hospital';

export interface Donor {
  id?: string;
  email: string;
  name: string;
  blood_group: string;
  age: number;
  phone_number: string;
  created_at?: string;
}

export interface Hospital {
  id?: string;
  email: string;
  name: string;
  address: string;
  blood_group: string;
  quantity: number;
  urgency: string;
  created_at?: string;
}

export interface AuthData {
  email: string;
  password: string;
  role: UserRole;
}

export interface SignUpDonorData extends AuthData {
  name: string;
  bloodGroup: string;
  age: number;
  phoneNumber: string;
  role: 'donor';
}

export interface SignUpHospitalData extends AuthData {
  name: string;
  address: string;
  bloodGroup: string;
  quantity: number;
  urgency: 'High' | 'Medium' | 'Low';
  role: 'hospital';
}

export type SignUpData = SignUpDonorData | SignUpHospitalData;

export interface LoginData {
  email: string;
  password: string;
  role: UserRole;
}

export const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
export const urgencyLevels = ["High", "Medium", "Low"];
