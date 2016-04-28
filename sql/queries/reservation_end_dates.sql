SELECT
    date(lower(during)) as "start",
    date(upper(during)) as "end" 
FROM "Reservations"
JOIN "Lodgings" ON "Lodgings".id = $<lodging>
WHERE lodging = $<lodging>
