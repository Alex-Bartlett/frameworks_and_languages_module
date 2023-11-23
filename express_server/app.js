const { log } = require('console');
const express = require('express');
const cors = require('cors');
const app = express()
const port = 8000

let data = {};
/**
 * Use an incrementing variable to generate unique ids for items.
 * No chance of duplicates since items are also just a variable
 * and will be cleared when server is stopped.
 */
let lastId = 1;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.get('/items', (req, res) => {
	res.status(200).json(Object.values(data));
})

app.get('/item/:id', (req, res) => {
	if (req.params.id) {
		const foundData = data[req.params.id];
		if (foundData) {
			// Item with given ID found
			res.status(200).json(foundData);
		}
		else {
			// Item with given ID not found
			res.sendStatus(404);
		}
	}
	else {
		// ID parameter not supplied
		res.sendStatus(400);
	}
})

app.post('/item', (req, res) => {
	// Add proper data validation here
	if (req.body.user_id) {
		let obj = req.body;
		obj.id = lastId;
		data[lastId] = obj;
		lastId++;

		// Convert keywords to an array
		obj.keywords = req.body.keywords.split(',');

		/**
		 * Required date format can be created by using toISOString() on a date object
		 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
		 */
		obj.date_from = new Date().toISOString();
		if (!obj.date_to) {
			obj.date_to = obj.date_from; // To prevent repetition, use the same date generated above.
		}
		res.status(201).json(obj);
	} else {
		res.sendStatus(405);
	}
})

app.delete('/item/:id', (req, res) => {
	if (req.params.id) {
		const foundData = data[req.params.id];
		if (foundData) {
			/**
			 * Delete must be used to remove an item since it is a property of an object.
			 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete
			 */
			delete data[req.params.id];

			// Item with given ID found and item deleted successfully
			res.sendStatus(204);
		}
		else {
			// Item with given ID not found
			res.sendStatus(404);
		}
	}
	// ID parameter not supplied
	res.sendStatus(405);
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
})