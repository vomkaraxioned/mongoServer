// Module calling
const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require("mongodb");
const url = 'mongodb://localhost:27017/tenet';
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const treeCreator = (data,tree)=>{
	data.map(({ website, page, url, performance, auditDate, nextAudit })=>{
		const obj = {url,performance,auditDate,nextAudit};
		if(!tree[website]) {
			tree[website] = [];
		}
		tree[website].push({page,url,performance,auditDate,nextAudit}) ;
	});
	return tree;
}

const preparedData = (data)=>{
	const tree = treeCreator(data,{});
	return tree;
}

const dbConnector = (orgName, userName, password, res) => {
	MongoClient.connect(url, (err, db) => {
		if (err) res.status(500).send({ message: err });
		db.collection('users').find({ $and: [{ username: userName }, { orgname: orgName }, { password: password }] }).toArray((err, data) => {
			try {
				if (err) throw err
				if (data.length < 1) throw "Invalid Credentials";
				res.status(200).json(data)
			} catch (err) {
				res.status(404).send({ message: err })
			}
		})
	});
}

const dataProvider = (id, res) => {
	MongoClient.connect(url, (err, db) => {
		if (err) res.status(500).send({ message: err });
		db.collection('dataset').find({ id: { $in: [id] } }).toArray((err, data) => {
			try {
				if (err) throw err
				if (data.length < 1) throw "Something went wrong";
				const requiredData = preparedData(data);
				res.status(200).json(requiredData);
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

app.post('/tenet/details', (req, res) => {
	const { id } = req.body;
	dataProvider(id, res);
});