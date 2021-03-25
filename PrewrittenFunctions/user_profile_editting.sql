/*user profile info editting*/

-- changing username
-- first check if new username is used or not
SELECT *
FROM users
WHERE username = "variable";

-- if not used then update
UPDATE users
SET username = "variable"
WHERE user_id = 1;

-- changing password
UPDATE users
SET password = "variable"
WHERE user_id = 1;

-- changing email
UPDATE users
SET email = "variable"
WHERE user_id = 1;

-- changing first and/or last name
UPDATE users
SET first_name = "variable"
WHERE user_id = 1;

UPDATE users
SET last_name = "variable"
WHERE user_id = 1;