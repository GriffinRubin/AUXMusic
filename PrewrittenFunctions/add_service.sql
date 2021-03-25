-- make sure the platform and user exists

SELECT *
FROM platform;

-- adds a service to a user profile

INSERT INTO has_service (users_user_id, platform_platform_id)
VALUE (1, 1);