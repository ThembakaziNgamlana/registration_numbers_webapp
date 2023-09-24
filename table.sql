CREATE TABLE towns (
    id SERIAL PRIMARY KEY,
    town_name VARCHAR(255) NOT NULL
);

CREATE TABLE registration_numbers (
    id SERIAL PRIMARY KEY,
    registration_number VARCHAR(20) NOT NULL,
    town_id INT REFERENCES towns(id)
);

INSERT INTO towns(town_name)VALUES
('Paarl'),
('CapeTown'),
('George');


