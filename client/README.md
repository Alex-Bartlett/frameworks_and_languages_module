# Freecycle Client

The Freecycle client uses the [Svelte](https://svelte.dev/) framework. It requires an active connection to a Freecycle server, supplied via url query ([see below](#connecting-to-the-server)).

## Launch the client

To run the client, run the following:

`cd client && npm install && npm run dev -- --host`

This will install the necessary packages and start the client locally on port 8001.

## Test the client

The client can be tested either using the github workflow `test_client`, or ran manually with the following command:

`make test_client`

## Use the client

The client provides a frontend for the Freecycle server, and therefore requires an instance of the Freecycle server to be running. The client can then be connected to the server by the following steps:

### Connecting to the server

1. Run an instance of the Freecycle server ([see documentation](../server/README.md))
2. Copy the server url (http://localhost:8000 by default)
3. Append the server url to the client url by setting it to the `api` parameter within the query string.
	
	`http://localhost:8001?api=http://localhost:8000`
4. The client should display *Connected* followed by the server url in the header

### Create a listing

Listing can be created by filling out the form, and clicking *create*. The new listing should appear on the page. Apart from *User ID*, all fields are optional.

## Deleting a listing

Listings can be deleted by clicking the *delete* button at the bottom of the listing.