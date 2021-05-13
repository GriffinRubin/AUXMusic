-- gets queue in a specific room by play order
SELECT DISTINCT q.play_order
FROM in_queue q, song s
-- sub room id with variable
WHERE queue_rooms_room_id = 1
AND q.song_song_id = s.song_id
ORDER BY play_order ASC;
