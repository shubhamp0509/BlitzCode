const mongoose=require('mongoose')


const Member=new mongoose.Schema({
    fName:{
        type:String,
    },
   
    address:{
        type:String

    },
    
    profession:{
        type:String

    },
    email:{
        type:String
    },
     dob:{
        type:Date,
       
    },
    mobile:{
        type:String,  
       
    },
    gender:{
        type:String,   
    },
    bloodGroup:{
        type:String
     
       
    },
    profeesion:{
            type:String
    },
    relation: {
        type: String 
    },
    


})





const MemberInfos =new mongoose.model("MemberInfos",Member)

module.exports=MemberInfos