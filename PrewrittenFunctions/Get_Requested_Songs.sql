-- Gets the list of requested songs in a specific room in order of number of requests
SELECT DISTINCT r.request_number, s.song_name
FROM requested r, song s
-- sub room id with variable input
WHERE requests_rooms_room_id = 1
AND r.song_song_id = s.song_id
ORDER BY r.request_number DESC;