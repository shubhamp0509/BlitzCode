const mongoose=require('mongoose')


const profile=new mongoose.Schema({

    profileImage:{
        type:String
    }
})

const Profile=new mongoose.model("Profile",profile);


module.exports=Profile