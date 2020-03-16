const express = require('express')
const app = express()
const mongoose = require('mongoose')
const options = require('./options.js');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())
app.use(express.urlencoded())
mongoose.connect("mongodb://52.14.161.145/maindatabase?authSource=admin",options)
.then((success)=>console.log("connected"))
.catch((err)=>console.log("could not connect:",err));
const schema=mongoose.Schema;
const nameSchema=new schema({
        id: Number,
        Name: String
},{collection:"Random"});
const detail=mongoose.model('Random',nameSchema);
app.get('/:id',(req, res)=>{
	//console.log(req.params.id);
	detail.find({id:req.params.id},(err, data)=>{
		//console.log(data);
		if(data.length == 0){
			res.json({"message":"Incorrect id. Please provide valid id!"})
		}
		else{
		res.json(data);}
	})
})
app.listen(3000)
