-- remove all song links from queue

DELETE FROM in_queue
WHERE queue_rooms_room_id = 1;

-- now remove queue link from room (thus removing the queue)

DELETE FROM queue
WHERE rooms_room_id = 1;