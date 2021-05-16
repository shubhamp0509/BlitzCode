const mongoose=require('mongoose')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const UserInfo=new mongoose.Schema({
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
    wardName:{type:String},
    isRegistered:{
        type:Boolean,
        default:false,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    profileImage:{
        type:String
        
    },
    memberList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'MemberInfos'
        

    }]
    // profile_image:{
    //     type:String
    // },
    // tokens:[{
    //     token:{
    //         type:String,
          
    //     }
    // }],


})

UserInfo.methods.generateAuthToken= async function(){
    try{
        const token=await jwt.sign({_id:this._id},"mynameishubhampathak");
        // this.tokens=this.tokens.concat({token:token})
        await this.save();
         return token;

    }catch(err){
            
        console.log("Error in token");
    }

}
UserInfo.pre("save",async function(next){

    if(this.isModified("password")){
    this.password=await bcrypt.hash(this.password,10);
    }
    next()


})


const Login=new mongoose.model("UserInfo",UserInfo)

module.exports=Login