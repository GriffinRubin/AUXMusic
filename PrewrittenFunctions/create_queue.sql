-- creates new queue for a room
-- insert vars into value fields
INSERT INTO queue (queue_id, rooms_room_id)
VALUES (1, 1);

-- make sure room exists by selecting for the room
SELECT *
FROM rooms
WHERE room_id = 1;

-- if the room exists make sure it doesn't have a queue already
-- sql will give an error code if a duplicate entry is attempted

