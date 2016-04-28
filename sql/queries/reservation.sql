
SELECT to_json(t) AS reservation FROM (
  SELECT
    r.id,
    r.created,
    json_build_object('upper', upper(r.during),
                      'lower', lower(r.during)) AS during,
    to_json(ur) as user_reservation,
    to_json(er) as external_reservation,
    to_json(l) as lodging,
    to_json(s) as seller
  FROM "Reservations" r

  JOIN "Lodgings" l ON l.id = r.lodging
  JOIN "Sellers" s ON s.user_id = l.owner
  LEFT JOIN "UserReservations" ur ON ur.reservation = r.id
  LEFT JOIN "ExternalReservations" er ON er.reservation = r.id

  WHERE r.id = ${reservation}) t
