
This the big query, which powers the lodging search. It searches via..

  * The query parameter, which is matched aganst the names of the lodgings, the city parts of the addresses and the company names of the sellers. 
  * The date range. If the range is specified, the query excludes lodgings with reservations intersecting with the specified range.
  * The amenity list. If the list is non-empty, only lodgings with all of the specified amenities are included.

## Why is it so ugly?
  1. The query parameter must be formatted as an open value, using the #-suffix, so that it can be combined with %s for LIKE queries. Due to limitations / safety measures in pg-promise, open values can't be null.
  2. PostgreSQL dosn't like empty arrays - the type checker throws a fit, unless every single usage of potentially empty arrays has explicit type annotations. This is done with the amenity list. 
  3. We have to modify the reservation date range to properly account for check-in/out times. I want to use a range parameter instead of two separate dates, in order to be consistent with other queries and to avoid having to validate two parameters.