# Public API (NestJS)

This service is responsible for publishing messages to which a specific microservice is subscribed.

---

## Responsibilities

- Receive requests
- Publish messages

---

## Installing App

1. Clone this repository `git clone https://github.com/S-Sergio-A/public-api.git`
2. Navigate to the root directory and add the`.env` file with your database and microservice data:
```
MONGO_USERNAME
MONGO_PASSWORD
MONGO_CLUSTER_URL
MONGO_DATABASE_NAME
   
REDIS_DB_NAME
REDIS_PASSWORD
REDIS_ENDPOINT
REDIS_PORT
      
JWT_SECRET
CLIENTS_JWT_SECRET
JWT_REFRESH_SECRET
JWT_EXPIRATION_TIME
JWT_REFRESH_EXPIRATION_TIME
   
PORT
FRONT_URL
```
3. Install dependencies

```javascript
npm install
```

---

### Running the server in development mode

```javascript
npm start:dev
```

### Running the server in production mode

```javascript
npm build

npm start:prod
```

# License

---

This project uses the following [license](https://github.com/S-Sergio-A/public-api/blob/master/LICENSE).
