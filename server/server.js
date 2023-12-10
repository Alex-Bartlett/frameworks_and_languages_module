// Javascript Feature: Modules
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
import Fastify from 'fastify';

// Fastify Feature: Plugins
// https://fastify.dev/docs/latest/Reference/Plugins
/**
 * Fastify doesn't natively support sending files in a response,
 * the following plugin implements a sendFile method
 * https://github.com/fastify/fastify-static
 */
import fastifyStatic from '@fastify/static'

// Javascript Feature: Destructuring Assignment
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
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
 * Fastify Feature: Hooks
 * https://fastify.dev/docs/latest/Reference/Hooks/
 *
 * Javascript Feature: Arrow Functions
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
 */
/**
 * Fastify-cors is a pain to get sending a 204 on an options request. Can get around this by
 * setting the headers in a preHandler hook and returning 204 on a preflight request
 * https://stackoverflow.com/questions/65557198/how-to-use-fastify-cors-to-enable-just-one-api-to-cross-domain
 */
fastify.addHook('preHandler', (req, res, done) => {
	const allowedPaths = ["/", "/item", "/item/:id", "/items", "/test"];
	const isPreflight = /options/i.test(req.method);

	if (allowedPaths.includes(req.routeOptions.url) || isPreflight) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
		res.header("Access-Control-Allow-Headers", "*");
		// Send 204 on a preflight request (options)
		if (isPreflight) {
			return res
				.code(204)
				.send();
		}
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

// Fastify Feature: Routes
// https://fastify.dev/docs/latest/Reference/Routes
fastify.get('/', async function handler(request, reply) {
	return reply
		.code(200)
		.sendFile("./docs.html")
});

// Javascript Feature: Asynchronous Functions
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
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
		// Convert keywords to an array
		if (typeof newItem.keyword === 'string') {
			newItem.keywords = body.keywords.split(',');
		}
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