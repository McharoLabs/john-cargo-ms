SELECT currency_code, currency_name, symbol, exchange_rate
FROM currency
WHERE base_currency_id IS NULL;  -- USD is the base currency, so base_currency_id will be NULL for USD


SELECT exchange_rate
FROM currency
WHERE currency_code = 'EUR' AND base_currency_id = '550e8400-e29b-41d4-a716-446655440000';  -- USD as the base


SELECT currency_code, currency_name, symbol, exchange_rate
FROM currency
WHERE base_currency_id = (SELECT currency_id FROM currency WHERE currency_code = 'EUR');
