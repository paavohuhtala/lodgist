
CREATE EXTENSION btree_gist;

CREATE TYPE user_role AS ENUM (
	'unverifiedUser',
	'user',
	'unapprovedSeller',
	'seller',
	'admin');

CREATE TABLE Addresses (
	id SERIAL PRIMARY KEY NOT NULL,
	street1 TEXT NOT NULL,
	street2 TEXT,
	postalCode TEXT NOT NULL,
	city TEXT NOT NULL,
	country CHAR(2) NOT NULL DEFAULT('FI')
);

CREATE TABLE Users (
	id SERIAL PRIMARY KEY NOT NULL,
	role user_role NOT NULL DEFAULT('unverifiedUser'),
	name TEXT NOT NULL,
	email VARCHAR(255) NOT NULL, -- IETF maximum for email address length
	password VARCHAR(60) NOT NULL, -- We're storing bcrypt hashes, which include the salt
	phone TEXT NOT NULL,
	address INTEGER REFERENCES Addresses(id) NOT NULL
);

CREATE TABLE Sessions (
	userId INTEGER REFERENCES Users(id) NOT NULL,
	created TIMESTAMP NOT NULL DEFAULT(now()::timestamp),
	validUntil TIMESTAMP NOT NULL DEFAULT(now()::timestamp + interval '14 days'),
	token CHAR(32) NOT NULL UNIQUE,
	PRIMARY KEY (userId)
);

CREATE TABLE Sellers (
	userId INTEGER REFERENCES Users(id) NOT NULL,
	companyName TEXT NOT NULL,
	billingAddress INTEGER REFERENCES Addresses(id),
	vatId TEXT NOT NULL,
	PRIMARY KEY (userId)
);

CREATE TABLE Amenities (
	id SERIAL PRIMARY KEY NOT NULL,
	name TEXT NOT NULL,
	icon TEXT
);

CREATE TABLE Lodgings (
	id SERIAL PRIMARY KEY NOT NULL,
	owner INTEGER REFERENCES Sellers(userId) NOT NULL,
	address INTEGER REFERENCES Addresses(id) NOT NULL,
	name TEXT NOT NULL,
	description TEXT NOT NULL,
	isPublic BOOLEAN NOT NULL DEFAULT(FALSE),
	reservationStart TIME NOT NULL,
	reservationEnd TIME NOT NULL,
	pricePerNight MONEY CHECK (pricePerNight > 0::money) NOT NULL,
	CHECK(reservationStart >= reservationEnd),
	area NUMERIC CHECK (area > 0),
	floors INTEGER CHECK (floors >= 1),
	builtYear INTEGER,
	renovatedYear INTEGER, 
	CHECK (renovatedYear >= builtYear)
);

CREATE TABLE LodgingAmenities (
	lodging INTEGER REFERENCES Lodgings(id) NOT NULL,
	amenity INTEGER REFERENCES Amenities(id) NOT NULL,
	PRIMARY KEY (lodging, amenity)
);

CREATE TYPE reservation_type AS ENUM ('external', 'user');

CREATE TABLE Reservations (
	id SERIAL PRIMARY KEY NOT NULL,
	lodging INTEGER REFERENCES Lodgings(id) NOT NULL,
	type reservation_type NOT NULL DEFAULT('user'),
	during tsrange NOT NULL,
	EXCLUDE USING gist (lodging WITH =, during WITH &&)
);

CREATE TABLE ExternalReservations (
	reservation INTEGER REFERENCES Reservations(id) NOT NULL,
	reason TEXT NOT NULL,
	PRIMARY KEY (reservation)
);

CREATE TABLE UserReservations (
	reservation INTEGER REFERENCES Reservations(id) NOT NULL,
	customer INTEGER REFERENCES Users(id) NOT NULL,
	price MONEY NOT NULL,
	PRIMARY KEY (customer, reservation)
);

CREATE TABLE Reviews (
	id SERIAL PRIMARY KEY NOT NULL,
	isPublic BOOLEAN NOT NULL DEFAULT(TRUE),
	lodging INTEGER REFERENCES Lodgings(id) NOT NULL,
	author INTEGER REFERENCES Users(id) NOT NULL,
	content TEXT NOT NULL,
	rating INTEGER CHECK (rating >= 1 AND rating <= 5)
);

CREATE VIEW Locations AS (SELECT DISTINCT city FROM Addresses);

CREATE INDEX city_index ON Addresses(lower(city));
CREATE INDEX session_token_index ON Sessions(token);
