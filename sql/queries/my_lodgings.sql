SELECT DISTINCT l.*, a.city, s.company_name
FROM "Lodgings" l

INNER JOIN "Sellers" s ON s.user_id = l.owner
INNER JOIN "Addresses" a ON l.address = a.id
LEFT JOIN "Reservations" r on l.id = r.lodging

WHERE s.user_id = ${user_id}

ORDER BY l.name, l.id DESC
