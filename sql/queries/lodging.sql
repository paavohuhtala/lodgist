
WITH "LodgingAmenitiesFlattened" AS (
  SELECT la.lodging, json_agg(a) AS amenities FROM "LodgingAmenities" la
  JOIN "Amenities" a ON a.id = la.amenity
  GROUP BY la.lodging)

SELECT to_json(r) AS lodging FROM (
   SELECT
     l.id,
     l.name,
     l.price_per_night,
     to_json(s) AS seller,
     to_json(a) AS address,
     to_json(laf.amenities) AS amenities
  FROM "Lodgings" l

  JOIN "Sellers" s ON s.user_id = l.owner
  JOIN "Addresses" a ON a.id = l.address
  LEFT JOIN "LodgingAmenitiesFlattened" laf ON laf.lodging = l.id

  WHERE l.id = ${lodging}) r
