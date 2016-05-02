
SELECT json_agg(t) AS reservations FROM (
  SELECT DISTINCT ON (r.id)
    r.id,
    r.created,
    c.name as customer_name,
    json_build_object('upper', upper(r.during),
                      'lower', lower(r.during)) AS during,
    to_json(ur) as user_reservation,
    to_json(er) as external_reservation,
    CASE
      WHEN r.during @> now()::timestamp THEN 'current'
      WHEN r.during && '[now, infinity]'::tsrange THEN 'upcoming'
      ELSE 'past'
    END AS status
  FROM "Reservations" r

  JOIN "Lodgings" l ON l.id = r.lodging
  LEFT JOIN "UserReservations" ur ON ur.reservation = r.id
  LEFT JOIN "ExternalReservations" er ON er.reservation = r.id
  LEFT JOIN "Users" c ON c.id = ur.customer

  WHERE l.id = ${lodging_id}) t
