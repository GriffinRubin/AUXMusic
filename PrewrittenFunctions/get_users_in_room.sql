-- grabs the user ids of every user in a room
SELECT u.user_id
FROM users u
WHERE u.rooms_room_id = 1;
-- add below line to only return the DJ on a room
-- AND u.isDJ = 1;