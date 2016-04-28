SELECT DISTINCT l.*, a.city, s.company_name
FROM "Lodgings" l

INNER JOIN "Sellers" s ON s.user_id = l.owner
INNER JOIN "Addresses" a ON l.address = a.id
LEFT JOIN "Reservations" r on l.id = r.lodging

WHERE (${query} = ''
        OR (name ILIKE '%$<query#>%')
        OR (s.company_name ILIKE '%$<query#>%')
        OR (a.city ILIKE '%$<query#>%'))

AND (${range} IS NULL
        OR ((SELECT COUNT(*) FROM "Reservations" rs WHERE rs.lodging = l.id) < 1)
        OR (NOT (
            tsrange(date_trunc('day', lower(tsrange(${range}))) + l.reservation_start,
                    date_trunc('day', upper(tsrange(${range}))) + l.reservation_end) && r.during)))

AND (${amenities}::integer[] IS NULL
        OR array_length(${amenities}::integer[], 1) < 1
        OR (SELECT amenities FROM "LodgingAmenityArrays" laa WHERE laa.lodging = l.id) @> ${amenities}::integer[])

ORDER BY l.name, l.id DESC
