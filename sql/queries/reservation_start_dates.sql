SELECT
    date(lower(during) - interval '1 day') as "start",
    date(upper(during) - interval '1 day') as "end"
FROM "Reservations"
JOIN "Lodgings" ON "Lodgings".id = $<lodging>
WHERE lodging = $<lodging>
