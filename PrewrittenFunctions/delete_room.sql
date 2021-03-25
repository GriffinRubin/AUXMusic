-- select all users in the room and remove them from the room

UPDATE users
SET rooms_room_id = null
WHERE rooms_room_id = 1;

-- next remove all songs from the request list and queue list of this room

DELETE FROM requested
WHERE requests_rooms_room_id = 1;

DELETE FROM in_queue
WHERE queue_rooms_room_id = 1;

-- next remove the request and queue lists themselves from the room

DELETE FROM requests
WHERE rooms_room_id = 1;

DELETE FROM queue
WHERE rooms_room_id = 1;

-- now that all foreign links of the room is gone we can delete the room
DELETE FROM rooms
WHERE room_id = 1;