-- Enhanced Database Migration for Real-time Seat Booking System
-- Execute this SQL script to add seat booking functionality

-- 1. Add seat-related columns to trains table
ALTER TABLE trains ADD COLUMN IF NOT EXISTS sleeper_seats INTEGER DEFAULT 100;
ALTER TABLE trains ADD COLUMN IF NOT EXISTS ac2_seats INTEGER DEFAULT 40;
ALTER TABLE trains ADD COLUMN IF NOT EXISTS ac1_seats INTEGER DEFAULT 30;
ALTER TABLE trains ADD COLUMN IF NOT EXISTS sleeper_price DECIMAL(10,2) DEFAULT 300.00;
ALTER TABLE trains ADD COLUMN IF NOT EXISTS ac2_price DECIMAL(10,2) DEFAULT 700.00;
ALTER TABLE trains ADD COLUMN IF NOT EXISTS ac1_price DECIMAL(10,2) DEFAULT 1300.00;
ALTER TABLE trains ADD COLUMN IF NOT EXISTS total_seats INTEGER GENERATED ALWAYS AS (sleeper_seats + ac2_seats + ac1_seats) STORED;

-- 2. Create seat_bookings table for real-time seat tracking
CREATE TABLE IF NOT EXISTS seat_bookings (
    id BIGSERIAL PRIMARY KEY,
    train_id BIGINT NOT NULL,
    seat_number INTEGER NOT NULL,
    seat_class VARCHAR(20) NOT NULL CHECK (seat_class IN ('SLEEPER', 'AC2', 'AC1')),
    booking_date DATE NOT NULL,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_email VARCHAR(100),
    passenger_phone VARCHAR(20),
    ticket_id BIGINT,
    booking_status VARCHAR(20) DEFAULT 'CONFIRMED' CHECK (booking_status IN ('CONFIRMED', 'CANCELLED', 'WAITING')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_seat_train FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE,
    CONSTRAINT fk_seat_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE SET NULL,
    CONSTRAINT unique_seat_booking UNIQUE (train_id, seat_number, seat_class, booking_date)
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_seat_bookings_train_date ON seat_bookings(train_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_seat_bookings_seat_class ON seat_bookings(seat_class);
CREATE INDEX IF NOT EXISTS idx_seat_bookings_status ON seat_bookings(booking_status);

-- 4. Update tickets table to include seat information
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS seat_numbers TEXT; -- JSON array of seat numbers
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS seat_class VARCHAR(20) DEFAULT 'SLEEPER';
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS base_price DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2) DEFAULT 0.00;

-- 5. Create seat availability view for easy querying
CREATE OR REPLACE VIEW seat_availability AS
SELECT 
    t.id as train_id,
    t.train_name,
    t.sleeper_seats,
    t.ac2_seats,
    t.ac1_seats,
    t.sleeper_price,
    t.ac2_price,
    t.ac1_price,
    sb.booking_date,
    COUNT(CASE WHEN sb.seat_class = 'SLEEPER' AND sb.booking_status = 'CONFIRMED' THEN 1 END) as sleeper_booked,
    COUNT(CASE WHEN sb.seat_class = 'AC2' AND sb.booking_status = 'CONFIRMED' THEN 1 END) as ac2_booked,
    COUNT(CASE WHEN sb.seat_class = 'AC1' AND sb.booking_status = 'CONFIRMED' THEN 1 END) as ac1_booked,
    (t.sleeper_seats - COUNT(CASE WHEN sb.seat_class = 'SLEEPER' AND sb.booking_status = 'CONFIRMED' THEN 1 END)) as sleeper_available,
    (t.ac2_seats - COUNT(CASE WHEN sb.seat_class = 'AC2' AND sb.booking_status = 'CONFIRMED' THEN 1 END)) as ac2_available,
    (t.ac1_seats - COUNT(CASE WHEN sb.seat_class = 'AC1' AND sb.booking_status = 'CONFIRMED' THEN 1 END)) as ac1_available
FROM trains t
LEFT JOIN seat_bookings sb ON t.id = sb.train_id
GROUP BY t.id, t.train_name, t.sleeper_seats, t.ac2_seats, t.ac1_seats, 
         t.sleeper_price, t.ac2_price, t.ac1_price, sb.booking_date;

-- 6. Function to get next available seat number
CREATE OR REPLACE FUNCTION get_next_available_seat(
    p_train_id BIGINT,
    p_seat_class VARCHAR(20),
    p_booking_date DATE
) RETURNS INTEGER AS $$
DECLARE
    seat_start INTEGER;
    seat_end INTEGER;
    next_seat INTEGER;
BEGIN
    -- Define seat number ranges based on class
    CASE p_seat_class
        WHEN 'SLEEPER' THEN
            seat_start := 1;
            SELECT sleeper_seats INTO seat_end FROM trains WHERE id = p_train_id;
        WHEN 'AC2' THEN
            SELECT sleeper_seats + 1 INTO seat_start FROM trains WHERE id = p_train_id;
            SELECT sleeper_seats + ac2_seats INTO seat_end FROM trains WHERE id = p_train_id;
        WHEN 'AC1' THEN
            SELECT sleeper_seats + ac2_seats + 1 INTO seat_start FROM trains WHERE id = p_train_id;
            SELECT sleeper_seats + ac2_seats + ac1_seats INTO seat_end FROM trains WHERE id = p_train_id;
    END CASE;
    
    -- Find the next available seat
    SELECT MIN(candidate_seat) INTO next_seat
    FROM generate_series(seat_start, seat_end) AS candidate_seat
    WHERE candidate_seat NOT IN (
        SELECT seat_number 
        FROM seat_bookings 
        WHERE train_id = p_train_id 
        AND seat_class = p_seat_class 
        AND booking_date = p_booking_date 
        AND booking_status = 'CONFIRMED'
    );
    
    RETURN next_seat;
END;
$$ LANGUAGE plpgsql;

-- 7. Function to check seat availability
CREATE OR REPLACE FUNCTION is_seat_available(
    p_train_id BIGINT,
    p_seat_number INTEGER,
    p_seat_class VARCHAR(20),
    p_booking_date DATE
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM seat_bookings 
        WHERE train_id = p_train_id 
        AND seat_number = p_seat_number 
        AND seat_class = p_seat_class 
        AND booking_date = p_booking_date 
        AND booking_status = 'CONFIRMED'
    );
END;
$$ LANGUAGE plpgsql;

-- 8. Update existing train data with default seat configuration
UPDATE trains SET 
    sleeper_seats = 100,
    ac2_seats = 40,
    ac1_seats = 30,
    sleeper_price = 300.00,
    ac2_price = 700.00,
    ac1_price = 1300.00
WHERE sleeper_seats IS NULL OR sleeper_seats = 0;

-- 9. Create trigger to update timestamps
CREATE OR REPLACE FUNCTION update_seat_booking_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_seat_booking_timestamp_trigger
    BEFORE UPDATE ON seat_bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_seat_booking_timestamp();

-- 10. Sample data for testing (optional)
-- INSERT INTO seat_bookings (train_id, seat_number, seat_class, booking_date, passenger_name, passenger_email)
-- VALUES 
-- (1, 1, 'SLEEPER', CURRENT_DATE, 'Test User 1', 'test1@example.com'),
-- (1, 2, 'SLEEPER', CURRENT_DATE, 'Test User 2', 'test2@example.com'),
-- (1, 101, 'AC2', CURRENT_DATE, 'Test User 3', 'test3@example.com');

COMMIT;
