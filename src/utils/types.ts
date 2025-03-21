
export type UserRole = 'donor' | 'hospital';

export interface Donor {
  email: string;
  name: string;
  bloodGroup: string;
  age: number;
  phoneNumber: string;
}

export interface Hospital {
  email: string;
  name: string;
  address: string;
  bloodGroup: string;
  quantity: number;
  urgency: 'High' | 'Medium' | 'Low';
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
