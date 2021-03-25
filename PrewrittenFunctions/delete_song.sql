-- first delete song link to any queue or request lists

DELETE FROM in_queue
WHERE song_song_id = 1;

DELETE FROM requested
WHERE song_song_id = 1;

-- now delete the song record from song table

DELETE FROM song
WHERE song_id = 1;