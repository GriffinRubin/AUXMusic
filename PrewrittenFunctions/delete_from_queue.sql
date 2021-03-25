-- delete song from specific queue
DELETE FROM in_queue
-- fill vars in song id, queue id and room id fields
WHERE song_song_id = 1
AND queue_queue_id = 1
AND queue_rooms_room_id = 1;