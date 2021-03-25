-- gets the request id for a specifc room
-- can be used to check that a room will have only 1 request list
SELECT r.requests_id
FROM requests r, rooms room
WHERE room.room_id = 1;