const { log } = require('console');
const express = require('express');
const cors = require('cors');
const app = express()
const port = 8000

let data = {};
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
			res.status(200).json(foundData);
		}
		else {
			res.sendStatus(404);
		}
	}
	else {
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
		res.status(201).json(obj);
	} else {
		res.sendStatus(405);
	}
})

app.delete('/item/:id', (req, res) => {
	if (req.params.id) {
		const foundData = data[req.params.id];
		if (foundData) {
			delete data[req.params.id];
			res.sendStatus(204);
		}
		else {
			res.sendStatus(404);
		}
	}
	res.sendStatus(405);
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
})