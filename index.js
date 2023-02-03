// Module calling
const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require("mongodb");
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Server path

const dbConnector = (orgName, userName, password, res) => {
	const url = 'mongodb://localhost:27017/tenet';
	MongoClient.connect(url, (err, db) => {
		if (err) res.status(500).send({ message: err });
		db.collection('users').find({ $and: [{ username: userName }, { orgname: orgName }, { password: password }] }).toArray((err, data) => {
			try {
				if (err) throw err
				if(data.length < 1) throw "Invalid Credentials"
				res.status(200).json(data)
			} catch (err) {
				res.status(404).send({ message: err })
			}
		})
	});
}


app.post('/tenet/login', (req, res) => {
	const { orgName, userName, password } = req.body;
	dbConnector(orgName, userName, password, res);
}).listen(3001);