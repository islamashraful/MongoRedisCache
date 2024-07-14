# Caching NodeJS App with Redis

This project includes a Node.js application with MongoDB and Redis services.

## Up and Running

```sh
npm i
docker-compose up
```

## Sample Requests

```bash
# Getting the blogs for user: 6693cc6d7a9129a0bdaf2ffb

# First time it serves from db,
# then it will be cached in redis,
# until a new blog created for this user
curl http://localhost:3000/blogs/6693cc6d7a9129a0bdaf2ffb

# Create new blog for user: 6693cc6d7a9129a0bdaf2ffb
curl -X POST \
  http://localhost:3000/blogs \
  -H 'Content-Type: application/json' \
  -d '{
    "user": "6693cc6d7a9129a0bdaf2ffb",
    "title": "Checking Cache",
    "content": "Checking cache invalidation"
  }'

# Get all blogs (doesn't use any cache)
curl http://localhost:3000/blogs

```

## Services

### Node.js Application

The Node.js application runs using Node.js version 18.

### MongoDB

MongoDB instance running the xenial version.

### Redis

Redis server using the redis-stack-server image.

## Useful Commands(Redis)

```sh
# Connect to the Redis server
docker exec -it my-redis-container redis-cli

# Return all keys in the current database
keys *

# Returns all field names in the hash stored at key
hkeys <key-with-quotes>

# Get the value of field
hget <key-with-quotes> <field>

# Create a hash with multiple fields
hset myhash field1 "value1" field2 "value2" field3 "value3"

# Check if a field exists (returns 1 if exists, 0 otherwise)
hexists myhash field

# Get all fields and values in the hash
hgetall myhash
```
