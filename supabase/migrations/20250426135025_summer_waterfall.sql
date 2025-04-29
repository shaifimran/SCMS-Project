/*
  # Initial Schema Setup

  1. New Tables
    - `departments`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `complaints`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `status` (text)
      - `priority` (text)
      - `department_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `staff_id` (uuid, foreign key, nullable)
      - `is_appealed` (boolean)
      - `feedback` (text)
      - `remarks` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'Verified',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  priority text NOT NULL DEFAULT 'TBA',
  department_id uuid REFERENCES departments(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  staff_id uuid REFERENCES auth.users(id),
  is_appealed boolean DEFAULT false,
  feedback text,
  remarks text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- Departments policies
CREATE POLICY "Anyone can read departments"
  ON departments
  FOR SELECT
  TO authenticated
  USING (true);

-- Complaints policies
CREATE POLICY "Users can read their own complaints"
  ON complaints
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    auth.uid() = staff_id OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'Admin'
    )
  );

CREATE POLICY "Users can create complaints"
  ON complaints
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own complaints"
  ON complaints
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id OR
    auth.uid() = staff_id OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'Admin'
    )
  );

-- Insert default departments
INSERT INTO departments (name) VALUES
  ('Technical Support'),
  ('Billing'),
  ('Sales'),
  ('Customer Support'),
  ('Product Development')
ON CONFLICT (name) DO NOTHING;