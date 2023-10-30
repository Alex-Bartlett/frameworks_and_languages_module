const express = require('express')
const app = express()
const port = 8000

const data = [
	{
		"user_id": "user1234",
		"name": "Alex"
	}
];
let lastId = 1;

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.get('/items', (req, res) => {
	res.status(200).json({ "data": true });
})

app.post('/item', (req, res) => {
	if (req.body.user_id) {
		let obj = req.body;
		obj.id = lastId;
		data.push(req.body);
		lastId++;
		res.status(201).json(obj);
	} else {
		res.sendStatus(405);
	}
})

app.delete('/', (req, res) => {
	res.sendStatus(405);
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})