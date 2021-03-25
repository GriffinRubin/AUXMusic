-- update play order for a song in queue
UPDATE in_queue
-- insert vars into play order and id fields
SET play_order = 1
WHERE song_song_id = 1
AND queue_queue_id = 1
AND queue_rooms_room_id = 1;