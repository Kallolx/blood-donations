-- Table for blood donations
CREATE TABLE blood_donations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  bloodGroup TEXT NOT NULL,
  age INTEGER NOT NULL,
  phoneNumber TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for blood requests
CREATE TABLE blood_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  bloodGroup TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  urgency TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


ALTER TABLE blood_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Anyone can view donations" 
  ON blood_donations FOR SELECT 
  USING (auth.role() = 'authenticated');


CREATE POLICY "Users can insert their own donations" 
  ON blood_donations FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'email' = email);


CREATE POLICY "Users can update their own donations" 
  ON blood_donations FOR UPDATE 
  USING (auth.jwt() ->> 'email' = email);


CREATE POLICY "Users can delete their own donations" 
  ON blood_donations FOR DELETE 
  USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Anyone can view requests" 
  ON blood_requests FOR SELECT 
  USING (auth.role() = 'authenticated');


  ON blood_requests FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'email' = email);


CREATE POLICY "Users can update their own requests" 
  ON blood_requests FOR UPDATE 
  USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can delete their own requests" 
  ON blood_requests FOR DELETE 
  USING (auth.jwt() ->> 'email' = email);
