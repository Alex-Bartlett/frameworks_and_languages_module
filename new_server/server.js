import Fastify from 'fastify';
/**
 * Fastify doesn't natively support cors, must be implemented via an extension
 * https://github.com/fastify/fastify-cors
 */

import fastifyStatic from '@fastify/static'
/**
 * __dirname is unavailable with ESM, this technique gets the dirname
 * https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-js-when-using-es6-modules
 */
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const fastify = Fastify({
	logger: true
});

// Package to send files as the response, used for root
fastify.register(fastifyStatic, {
	root: __dirname
})


/**
 * Fastify-cors is a pain to get sending a 204 on an options request. Can get around this by manually
 * setting the headers and returning 204 on a preflight request (which options seems to be)
 * https://stackoverflow.com/questions/65557198/how-to-use-fastify-cors-to-enable-just-one-api-to-cross-domain
 */
fastify.addHook('preHandler', (req, res, done) => {
	const allowedPaths = ["/", "/item", "/items", "/test"];
	if (allowedPaths.includes(req.routerPath)) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
	}

	const isPreflight = /options/i.test(req.method);
	if (isPreflight) {
		return res
			.header("Access-Control-Allow-Origin", "*")
			.code(204)
			.send();
	}

	done();
})


/**
 * Use an incrementing variable to generate unique ids for items.
 * No chance of duplicates since items are also just a variable
 * and will be cleared when server is stopped.
 */
let nextId = 1;
let data = {};

fastify.get('/', async function handler(request, reply) {
	return reply
		.code(200)
		.sendFile("./docs.html")
});

fastify.get('/items', async function handler(request, reply) {
	reply
		.code(200)
		.header('Content-Type', 'application/json')
		.send(Object.values(data))
})

fastify.get('/item/:id', async function handler(request, reply) {
	const id = request.params.id;
	const foundData = data[id];
	if (foundData) {
		reply
			.code(200)
			.header('Content-Type', 'application/json')
			.send(foundData)
	}
	else {
		reply.code(404);
	}
})

fastify.post('/item', async function handler(request, reply) {
	const body = request.body;
	// Add data validation method here instead of (body)
	if (body.user_id) {
		let newItem = body;
		newItem.id = nextId;
		data[nextId] = newItem;
		nextId++;

		/**
		 * Required date format can be created by using toISOString() on a date object
		 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
		 */
		newItem.date_from = new Date().toISOString();
		if (!newItem.date_to) {
			newItem.date_to = newItem.date_from; // To prevent repetition, use the same date generated above.
		}
		reply
			.code(201)
			.send(newItem)
	}
	else {
		reply.code(405);
	}
})

fastify.delete('/item/:id', async function handler(request, reply) {
	const id = request.params.id;
	if (data[id]) {
		/**
		 * Delete must be used to remove an item since it is a property of an object.
		 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete
		 */
		delete data[id];
		// Item with given ID found and item deleted successfully
		reply
			.code(204);
	}
	else {
		// Item with given ID not found
		reply.code(404)
	}
})

try {
	/**
	 * Host must be specified to expose the app with docker
	 * https://fastify.dev/docs/latest/Guides/Getting-Started/
	 */
	await fastify.listen({ port: 8000, host: '0.0.0.0' })
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}