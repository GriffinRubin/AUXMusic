-- remove all songs from the request list of this room

DELETE FROM requested
WHERE requests_rooms_room_id = 1;

-- now remove the list link to its room (thus removing the list)

DELETE FROM requests
WHERE rooms_room_id = 1;