
export type Database = {
  public: {
    Tables: {
      donor_info: {
        Row: {
          email: string;
          name: string;
          bloodGroup: string;
          age: number;
          phoneNumber: string;
          created_at?: string;
        };
        Insert: {
          email: string;
          name: string;
          bloodGroup: string;
          age: number;
          phoneNumber: string;
          created_at?: string;
        };
        Update: {
          email?: string;
          name?: string;
          bloodGroup?: string;
          age?: number;
          phoneNumber?: string;
          created_at?: string;
        };
      };
      hospital_info: {
        Row: {
          email: string;
          name: string;
          address: string;
          bloodGroup: string;
          quantity: number;
          urgency: 'High' | 'Medium' | 'Low';
          created_at?: string;
        };
        Insert: {
          email: string;
          name: string;
          address: string;
          bloodGroup: string;
          quantity: number;
          urgency: 'High' | 'Medium' | 'Low';
          created_at?: string;
        };
        Update: {
          email?: string;
          name?: string;
          address?: string;
          bloodGroup?: string;
          quantity?: number;
          urgency?: 'High' | 'Medium' | 'Low';
          created_at?: string;
        };
      };
    };
  };
};
