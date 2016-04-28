DROP EXTENSION IF EXISTS btree_gist CASCADE;

DROP TYPE IF EXISTS "user_role" CASCADE;
DROP TYPE IF EXISTS "reservation_type" CASCADE;

DROP TABLE IF EXISTS "Addresses" CASCADE;
DROP TABLE IF EXISTS "Users" CASCADE;
DROP TABLE IF EXISTS "Sessions" CASCADE;
DROP TABLE IF EXISTS "Sellers" CASCADE;
DROP TABLE IF EXISTS "Amenities" CASCADE;
DROP TABLE IF EXISTS "Lodgings" CASCADE;
DROP TABLE IF EXISTS "LodgingAmenities" CASCADE;
DROP TABLE IF EXISTS "Reservations" CASCADE;
DROP TABLE IF EXISTS "ExternalReservations" CASCADE;
DROP TABLE IF EXISTS "UserReservations" CASCADE;
DROP TABLE IF EXISTS "Reviews" CASCADE;

DROP VIEW IF EXISTS "Locations" CASCADE;
DROP VIEW IF EXISTS "LodgingAmenityArrays" CASCADE;

DROP INDEX IF EXISTS "city_index" CASCADE;
DROP INDEX IF EXISTS "session_token_index" CASCADE;