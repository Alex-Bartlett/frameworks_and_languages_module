import Fastify from 'fastify';
/**
 * Fastify doesn't natively support cors, must be implemented via an extension
 * https://github.com/fastify/fastify-cors
 */
import cors from '@fastify/cors';

const fastify = Fastify({
	logger: true
});
fastify.register(cors, {});

/**
 * Use an incrementing variable to generate unique ids for items.
 * No chance of duplicates since items are also just a variable
 * and will be cleared when server is stopped.
 */
let nextId = 0;
let data = { 1: { name: "Alex", surname: "Bartlett" } };

fastify.get('/', async function handler(request, reply) {
	reply
		.code(200)
		.send("Hello world");
});

fastify.get('/items', async function handler(request, reply) {
	reply
		.code(200)
		.header('Content-Type', 'application/json')
		.send(Object.values(data))
})

fastify.get('/item/:id', async function handler(request, reply) {
	const id = request.params;
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
	if (body) {
		let newItem = body;
		newItem.id = nextId;
		data[nextId] = newItem;
		nextId++;

		/**
		 * Required date format can be created by using toISOString() on a date object
		 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
		 */
		obj.date_from = new Date().toISOString();
		if (!obj.date_to) {
			obj.date_to = obj.date_from; // To prevent repetition, use the same date generated above.
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
	const id = request.params;
	if (data[id]) {
		/**
		 * Delete must be used to remove an item since it is a property of an object.
		 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete
		 */
		delete data[id];
		// Item with given ID found and item deleted successfully
		reply.code(204);
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