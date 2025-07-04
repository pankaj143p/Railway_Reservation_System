-- Database Migration Script for Railway Reservation System
-- Adding new columns to train_details table

-- Add isActive column with default value true
ALTER TABLE train_details 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add operationalStatus column with default value 'OPERATIONAL'
ALTER TABLE train_details 
ADD COLUMN IF NOT EXISTS operational_status VARCHAR(50) DEFAULT 'OPERATIONAL';

-- Add maintenanceNotes column
ALTER TABLE train_details 
ADD COLUMN IF NOT EXISTS maintenance_notes VARCHAR(500);

-- Update existing records to have default values
UPDATE train_details 
SET is_active = true 
WHERE is_active IS NULL;

UPDATE train_details 
SET operational_status = 'OPERATIONAL' 
WHERE operational_status IS NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'train_details' 
AND column_name IN ('is_active', 'operational_status', 'maintenance_notes');
