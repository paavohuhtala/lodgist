SELECT to_json(t) AS "user" FROM (
  SELECT
    u.*,
    user_address,
    to_json(s.*) as seller,
    seller_address
  FROM "Users" u
  JOIN "Addresses" user_address ON u.address = user_address.id
  LEFT JOIN "Sellers" s ON u.id = s.user_id
  LEFT JOIN "Addresses" seller_address on s.billing_address = s.user_id
  WHERE u.id = ${user_id}
) t