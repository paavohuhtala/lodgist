
SELECT json_agg(t) AS reservations FROM (
  SELECT DISTINCT ON (r.id)
    r.id,
    r.created,
    json_build_object('upper', upper(r.during),
                      'lower', lower(r.during)) AS during,
    to_json(ur) as user_reservation,
    to_json(l) as lodging,
    to_json(s) as seller,
    CASE
      WHEN r.during @> now()::timestamp THEN 'current'
      WHEN r.during && '[now, infinity]'::tsrange THEN 'upcoming'
      ELSE 'past'
    END AS status
  FROM "Reservations" r

  JOIN "Lodgings" l ON l.id = r.lodging
  JOIN "Sellers" s ON s.user_id = l.owner
  INNER JOIN "UserReservations" ur ON ur.customer = r.id

  WHERE ur.customer = ${customer}) t
