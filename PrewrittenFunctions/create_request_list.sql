-- create a request list for a room
-- sub in vars in values field
INSERT INTO requests (requests_id, rooms_room_id)
VALUES (1, 1);

-- make sure request id is unique and unique to a specific room id
-- sql will give error if duplicate
-- make sure room exists by selecting for the room
SELECT *
FROM rooms
WHERE room_id = 1;