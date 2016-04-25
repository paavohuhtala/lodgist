
INSERT INTO "Addresses" (street1, postal_code, city) VALUES
	('Demonipolku 6', '00666', 'Kerava'),
	('Low Earth Orbit', '01337', 'Space'),
	('Placeholderin Katu N', '0101010', 'Undefinedin kaupunki'),
	('Placeholderin Katu N + 1', '0101010', 'Undefinedin kaupunki');

INSERT INTO "Addresses" (street1, street2, postal_code, city) VALUES
	('Leppäsuonkatu 11', 'Christina Regina', '00100', 'Helsinki');

INSERT INTO "Users" (role, name, email, password, phone, address) VALUES
	('user', 'Asiakas', 'asiakas@example.com',
	'$2a$10$OZe9MT3tTZl/TU7fu8VNB.xQU66.C.Ltuv7MqaEAX/ZnVY5K7TSaq ', -- 'salasana'
	'123-456', 5),
	('seller', 'Myyjä', 'myyjä@example.com',
	'$2a$10$OZe9MT3tTZl/TU7fu8VNB.xQU66.C.Ltuv7MqaEAX/ZnVY5K7TSaq', -- 'salasana',
	'123-457', 5),
	('seller', 'Järjestelmänvalvoja', 'admin@example.com',
	'$2a$10$OZe9MT3tTZl/TU7fu8VNB.xQU66.C.Ltuv7MqaEAX/ZnVY5K7TSaq.IYK', -- 'salasana'
	'123-458', 5);

INSERT INTO "Sellers" (user_id, company_name, vatId) VALUES
	(2, 'Myyjän myymälä', 'FI12345678');

INSERT INTO "Amenities" (name) VALUES
	('Sauna'),
	('Tiskikone'),
	('Oma ranta'),
	('Laituri'),
	('Venevarasto'),
	('LCD-televisio'),
	('Lemmikit sallittuja');

INSERT INTO "Lodgings" (owner, address, name, description, is_public, reservation_start, reservation_end, price_per_night) VALUES
	(3, 2, 'Kansainvälinen avaruusasema',
	'1990-luvun lopulla rakennettu ja useaan otteeseen laajennettu jännittävä kohde matallalla maan kiertoradalla!',
	TRUE, '12:00:00', '10:00:00', 10000);

INSERT INTO "LodgingAmenities" (lodging, amenity) VALUES
	(1, 6),
	(1, 1);

INSERT INTO "Reservations" (lodging, type, during) VALUES
	(1, 'external', '[2016-01-01, 2016-06-01 06:00:00]'),
	(1, 'user', '[2016-06-01 12:00:00, 2016-06-04 10:00:00)');

INSERT INTO "ExternalReservations" (reservation, reason) VALUES
	(1, 'Remontissa.');

INSERT INTO "UserReservations" (reservation, customer, price, is_paid, paid) VALUES
	(2, 1, 440, TRUE, now()::timestamp - interval '2 hours');

INSERT INTO "Reviews" (lodging, author, content, rating) VALUES
	(1, 3, '5/5 proper great', 5);