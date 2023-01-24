// Module calling
const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require("mongodb");
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Server path

const dbConnector = (orgName,userName,password,res)=>{
	const url = 'mongodb://localhost:27017/tenet';
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		db.collection('users').find({ $and: [ {username:userName}, {orgname:orgName},{password:password} ] }).toArray((err,data)=>{
			if(err) throw err;
			data.length > 0 ? res.json(data) : res.json(null)
		})
	});
}


app.post('/tenet/login',(req,res)=>{
	const { orgName,userName,password } = req.body;
	dbConnector(orgName,userName,password,res);
}).listen(3001);