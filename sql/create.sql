
CREATE EXTENSION btree_gist;

CREATE TYPE "user_role" AS ENUM (
	'unverifiedUser',
	'user',
	'unapprovedSeller',
	'seller',
	'admin');

CREATE TABLE "Addresses" (
	id SERIAL PRIMARY KEY NOT NULL,
	street1 TEXT NOT NULL,
	street2 TEXT,
	postal_code TEXT NOT NULL,
	city TEXT NOT NULL,
	country CHAR(2) NOT NULL DEFAULT('FI')
);

CREATE TABLE "Users" (
	id SERIAL PRIMARY KEY NOT NULL,
	role user_role NOT NULL DEFAULT('unverifiedUser'),
	name TEXT NOT NULL,
	email VARCHAR(255) NOT NULL, -- IETF maximum for email address length
	password VARCHAR(60) NOT NULL, -- We're storing bcrypt hashes, which include the salt
	phone TEXT NOT NULL,
	address INTEGER REFERENCES "Addresses"(id) NOT NULL
);

CREATE TABLE "Sessions" (
	user_id INTEGER REFERENCES "Users"(id) NOT NULL,
	created TIMESTAMP NOT NULL DEFAULT(now()::timestamp),
	valid_until TIMESTAMP NOT NULL DEFAULT(now()::timestamp + interval '14 days'),
	token CHAR(32) NOT NULL UNIQUE,
	PRIMARY KEY (user_id)
);

CREATE TABLE "Sellers" (
	user_id INTEGER REFERENCES "Users"(id) NOT NULL,
	company_name TEXT NOT NULL,
	billing_address INTEGER REFERENCES "Addresses"(id),
	vatId TEXT NOT NULL,
	PRIMARY KEY (user_id)
);

CREATE TABLE "Amenities" (
	id SERIAL PRIMARY KEY NOT NULL,
	name TEXT NOT NULL,
	icon TEXT
);

CREATE TABLE "Lodgings" (
	id SERIAL PRIMARY KEY NOT NULL,
	owner INTEGER REFERENCES "Sellers"(user_id) NOT NULL,
	address INTEGER REFERENCES "Addresses"(id) NOT NULL,
	name TEXT NOT NULL,
	description TEXT NOT NULL,
	is_public BOOLEAN NOT NULL DEFAULT(FALSE),
	reservation_start TIME NOT NULL,
	reservation_end TIME NOT NULL,
	price_per_night NUMERIC(12, 2) CHECK (price_per_night > 0) NOT NULL,
	CHECK(reservation_start >= reservation_end),
	area NUMERIC CHECK (area > 0),
	floors INTEGER CHECK (floors >= 1),
	built_year INTEGER,
	renovated_year INTEGER, 
	CHECK (renovated_year >= built_year)
);

CREATE TABLE "LodgingAmenities" (
	lodging INTEGER REFERENCES "Lodgings"(id) NOT NULL,
	amenity INTEGER REFERENCES "Amenities"(id) NOT NULL,
	PRIMARY KEY (lodging, amenity)
);

CREATE TYPE "reservation_type" AS ENUM ('external', 'user');

CREATE TABLE "Reservations" (
	id SERIAL PRIMARY KEY NOT NULL,
	lodging INTEGER REFERENCES "Lodgings"(id) NOT NULL,
	type reservation_type NOT NULL DEFAULT('user'),
	during tsrange NOT NULL,
	EXCLUDE USING gist (lodging WITH =, during WITH &&)
);

CREATE TABLE "ExternalReservations" (
	reservation INTEGER REFERENCES "Reservations"(id) NOT NULL,
	reason TEXT NOT NULL,
	PRIMARY KEY (reservation)
);

CREATE TABLE "UserReservations" (
	reservation INTEGER REFERENCES "Reservations"(id) NOT NULL,
	customer INTEGER REFERENCES "Users"(id) NOT NULL,
	price NUMERIC(12, 2) NOT NULL,
	is_paid BOOLEAN NOT NULL DEFAULT(FALSE),
	PRIMARY KEY (customer, reservation)
);

CREATE TABLE "Reviews" (
	id SERIAL PRIMARY KEY NOT NULL,
	is_public BOOLEAN NOT NULL DEFAULT(TRUE),
	lodging INTEGER REFERENCES "Lodgings"(id) NOT NULL,
	author INTEGER REFERENCES "Users"(id) NOT NULL,
	content TEXT NOT NULL,
	rating INTEGER CHECK (rating >= 1 AND rating <= 5)
);

CREATE VIEW "Locations" AS (SELECT DISTINCT city FROM "Addresses");

CREATE INDEX "city_index" ON "Addresses"(lower(city));
CREATE INDEX "session_token_index" ON "Sessions"(token);
CREATE INDEX "user_emails" ON "Users"(lower(email));
