export type Database = {
  public: {
    Tables: {
      blood_donations: {
        Row: {
          id: string;
          email: string;
          name: string;
          blood_group: string;
          age: number;
          phone_number: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          blood_group: string;
          age: number;
          phone_number: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          blood_group?: string;
          age?: number;
          phone_number?: string;
          created_at?: string;
        };
      };
      blood_requests: {
        Row: {
          id: string;
          email: string;
          name: string;
          address: string;
          blood_group: string;
          quantity: number;
          urgency: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          address: string;
          blood_group: string;
          quantity: number;
          urgency: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          address?: string;
          blood_group?: string;
          quantity?: number;
          urgency?: string;
          created_at?: string;
        };
      };
    };
  };
};
