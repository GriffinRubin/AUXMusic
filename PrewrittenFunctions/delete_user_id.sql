-- check if user is in a room
SELECT rooms_room_id
FROM users
WHERE user_id = 1;

-- if the room id from above query isn't null then user is in a room
-- take the user out of the room then delete
UPDATE users
SET rooms_room_id = null
WHERE user_id = 1;

-- check if user has platforms linked to it, insert user id
SELECT platform_platform_id
FROM has_service
WHERE users_user_id = 1;

-- must also delete from any platforms that the user is linked to if there are some
DELETE FROM has_service
WHERE users_user_id = 1;

-- after above conidtions are met, delete user based on user id
DELETE FROM users 
WHERE user_id = 1;