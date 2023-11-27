# Freecycle Server

The Freecycle server uses the [Fastify](https://fastify.dev/) framework, for Node.js. The server exposes an API to get, post, and delete items from the database (a dictionary stored in the variable `data`).

## Launch the server

To launch the server, run the following:

`cd server && npm install && node server`

This will install the necessary packages and start the server locally on port 8000.

## Test the server

The server can be tested either using the github workflow `test_client`, or ran manually with the following command:

`make test_server`

## Use the server

The server can be used with a client, found under the `client` folder. This is made with the [Svelte](https://svelte.dev/) framework and is built with [Vite](https://vitejs.dev/). To run the client in a dev environment, use the following command:

`cd client && npm run dev -- --host`

This will run the server locally on port 8001, and will hot-reload as you develop.

Alternatively, you can directly use the API with the following routes:
- /items - GET
- /item/[id] - GET
- /item - POST
- /item/[id] - DELETE

Example curl commands for these routes:

- `curl http://localhost:8000/items`
*Returns all items in JSON format.*
- `curl http://localhost:8000/item/[id]`
*Returns the item with the given ID*
- `curl -X POST http://localhost:8000/item -H "Content-Type: application/json" -d '{"user_id": "Item123", "keywords": ["Example", "Item", "Listing"], "description": "An example item listing", "lat": 51.2798438, "lon": 1.0830275}'`
*Creates a new listing with the given data. Returns the new item in JSON format on success.*
- `curl -X DELETE http://localhost:8000/item/[item id]`
*Deletes the item with the given id.*