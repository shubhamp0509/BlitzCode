const mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/Demo",{

useNewUrlParser:true,
useUnifiedTopology:true,
useCreateIndex:true,
useFindAndModify:false,

}).then(()=>{
    console.log("Connection succesfull...");
}).catch((e)=>{
    console.log("Connection failed..");
})


module.exports=mongoose;