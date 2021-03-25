-- update play order for a song in queue
UPDATE requested
-- insert vars into play order and id fields
SET request_number = request_number + 1
WHERE song_song_id = 19
AND requests_requests_id = 1
AND requests_rooms_room_id = 1;