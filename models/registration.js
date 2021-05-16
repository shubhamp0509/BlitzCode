const mongoose=require('mongoose')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const userForm=new mongoose.Schema({
    fName:{
        type:String,
       
    },
    mName:{
        type:String,
    },
    lName:{
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
    password: {
        type: String 
    },
    profile_image:{
        type:String
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    
    
    // status: { 

    //     type: String, 
        
    //     enum : ['Pending', 'Active'], 
        
    //     default: 'Pending' 
        
    //     }, 
   

})

const profile=new mongoose.Schema({

    profileImage:{
        type:String
    }
})




userForm.methods.generateAuthToken= async function(){
    try{
        const token=await jwt.sign({_id:this._id},"mynameishubhampathak");
        this.tokens=this.tokens.concat({token:token})
        await this.save();
         return token;

    }catch(err){
            
        console.log("Error in token");
    }

}

userForm.pre("save",async function(next){

    if(this.isModified("password")){
    this.password=await bcrypt.hash(this.password,10);
    }
    next()


})
const Registration=new mongoose.model("Registration",userForm)


module.exports=Registration
