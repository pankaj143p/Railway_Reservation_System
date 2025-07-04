-- Database Migration Script for Railway Reservation System
-- Adding new columns to train_details and user_details tables

-- ========== TRAIN MANAGEMENT ENHANCEMENTS ==========
-- Add isActive column with default value true
ALTER TABLE train_details 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add operationalStatus column with default value 'OPERATIONAL'
ALTER TABLE train_details 
ADD COLUMN IF NOT EXISTS operational_status VARCHAR(50) DEFAULT 'OPERATIONAL';

-- Add maintenanceNotes column
ALTER TABLE train_details 
ADD COLUMN IF NOT EXISTS maintenance_notes VARCHAR(500);

-- Update existing train records to have default values
UPDATE train_details 
SET is_active = true 
WHERE is_active IS NULL;

UPDATE train_details 
SET operational_status = 'OPERATIONAL' 
WHERE operational_status IS NULL;

-- ========== USER MANAGEMENT ENHANCEMENTS ==========
-- Add isActive column to user_details table with default value true
ALTER TABLE user_details 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing user records to have default values
UPDATE user_details 
SET is_active = true 
WHERE is_active IS NULL;

-- ========== VERIFICATION QUERIES ==========
-- Verify the changes for trains
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'train_details' 
AND column_name IN ('is_active', 'operational_status', 'maintenance_notes');

-- Verify the changes for users
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'user_details' 
AND column_name IN ('is_active');

-- ========== EXAMPLE QUERIES FOR TESTING ==========
-- Show all active trains
SELECT train_id, train_name, operational_status, is_active 
FROM train_details 
WHERE is_active = true;

-- Show all active users
SELECT id, full_name, email, role, is_active 
FROM user_details 
WHERE is_active = true;
