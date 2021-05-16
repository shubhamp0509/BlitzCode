const express=require('express');
const bodyParser=require('body-parser')
const cors=require('cors');
 


const {mongoose}=require('./db.js');

var RegController=require('./controller/RegController.js');
var LoginController=require('./controller/LoginController.js');


var app=express()

const port=process.env.PORT  || 3000;
app.use(cors({origin:'http://localhost:8100'}));

app.use(bodyParser.json());

app.listen(port,()=>{
    console.log("server is running...");
})


app.use('/registration',RegController)
app.use('/login',LoginController)


