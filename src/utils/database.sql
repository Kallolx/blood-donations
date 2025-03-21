
-- Create donor_info table
CREATE TABLE IF NOT EXISTS donor_info (
  email TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bloodGroup TEXT NOT NULL,
  age INTEGER NOT NULL,
  phoneNumber TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hospital_info table
CREATE TABLE IF NOT EXISTS hospital_info (
  email TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  bloodGroup TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  urgency TEXT NOT NULL CHECK (urgency IN ('High', 'Medium', 'Low')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS (Row Level Security) policies
ALTER TABLE donor_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_info ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to view all donor info (public read)
CREATE POLICY "Public donors read" ON donor_info
  FOR SELECT USING (true);

-- Policy to allow anyone to view all hospital info (public read)
CREATE POLICY "Public hospitals read" ON hospital_info
  FOR SELECT USING (true);

-- Policy to allow users to insert their own donor record
CREATE POLICY "Users can insert their own donor record" ON donor_info
  FOR INSERT WITH CHECK (auth.uid()::text = email);

-- Policy to allow users to insert their own hospital record
CREATE POLICY "Users can insert their own hospital record" ON hospital_info
  FOR INSERT WITH CHECK (auth.uid()::text = email);

-- Policy to allow users to update their own donor record
CREATE POLICY "Users can update their own donor profile" ON donor_info
  FOR UPDATE USING (auth.uid()::text = email);

-- Policy to allow users to update their own hospital record
CREATE POLICY "Users can update their own hospital profile" ON hospital_info
  FOR UPDATE USING (auth.uid()::text = email);
