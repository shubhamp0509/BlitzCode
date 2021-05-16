const express=require('express')
var router=express.Router()
const ObjectId=require('mongoose').Types.ObjectId;
const Regist=require('../models/registration');
const profile=require("../models/profile");
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const cookieParser = require('cookie-parser');
var multer  = require('multer')
// const accountSid = 'ACe2e0534b44d8f7bcdcf10bc80e3274b0'; 
// const authToken = 'c64c237669885d8787e3625ec4fa01bc'; 
// const client = require('twilio')(accountSid, authToken); 




var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+file.originalname )
  }
})

const fileFilter=(req,file,cb)=>{
  if(file.mimetype==='image/jpeg' || file.mimetype==='image/jpg' || file.mimetype==='image/png'){
    cb(null,true)
  }else{
    cb(null,false)
  }

}

var upload = multer({ storage:storage,limits: {
  // Setting Image Size Limit to 2MBs
  fileSize: 2000000
},fileFilter:fileFilter

});

function authenticateToken(req, res, next) {

   console.log( req.headers['auth']);
  const authHeader = req.headers['auth']
  // const token = authHeader && authHeader.split(' ')[1]
  let token=authHeader
  // console.log(token);

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, "mynameishubhampathak", (err, user) => {
    // console.log(err)

    if (err) return res.status(403).send("unauthorization")

    req.user = user

    next()
  })
}


router.post('/imagePost',upload.single('profile_pic'),async(req,res)=>{

  console.log("image")
  const result=new profile({
    profileImage:req.file.path


  })
  const v= await result.save();




})





router.post('/',upload.single('profile_pic'), async(req,res)=>{
 console.log(req.file);
    try{
    const  rec=new Regist({
   
         fName:req.body.name,
         mName:req.body.Mname,
         lName:req.body.Lname,
         address:req.body.address,
         profession:req.body.profession,
         email:req.body.email,
         dob:req.body.dob,
         mobile:req.body.mobile,
         gender:req.body.gender,
         bloodGroup:req.body.blodGroup,
         profession:req.body.profession,
         password:req.body.password,
         profile_image:req.file.path
     })

    //  console.log("Sucess part is"+rec);
    const token =await rec.generateAuthToken()
    // console.log("Token part is "+token);

    const v= await rec.save();
    return res.send({token});
    // console.log(v);
    // console.log("Post method call");
   }catch(err){
     console.log("in catch");
     res.status(400).send(err);
   }




})


router.get('/:email',authenticateToken,(req,res)=>{
  
     Regist.findOne({email:req.params.email},(err,doc)=>{
              if(!err){
              console.log("in get call login")
              res.send(doc)
              }
              else
              console.log('Error in retriving');

      })


})





router.post('/login',async(req,res)=>{

  console.log("Callaed"+req.body.username);

     
  try{
   
    const email=req.body.username
   const password=req.body.password

  var useremail=await Regist.findOne({email:email})
  if(useremail==null){
    return res.send({msg:"Unathorised user"});

  }
    
    const isMatch=await bcrypt.compare(password,useremail.password)
    const token =await useremail.generateAuthToken()
    

  if(isMatch){
    console.log("Correct password and email matched");
    
    return res.send({token:token,email:email});
   
  }else{
  // console.log("password is wrong")
  return res.send({msg:"Unathorised user"});
  }

    
    

  }catch(err){
    res.status(400).send(err)

  }

})

// router.get('/login',(req,res)=>{
//   console.log("call"+req.query.phonenumber)

//   client
//       .verify
//       .services('VA11e80b04e286c3c556a5471fd751b1e2')
//       .verifications
//       .create({
//           to:`+91${req.query.phonenumber}`,
         
//           channel:req.query.channel
//       })
//           .then((data)=>{
//               res.status(200).send(data)
//           }).catch((err)=>{
//             res.status(401).send(err);

//           })
// });

// router.get('/verify',(req,res)=>{
//   console.log("Verify call"+req.query.code)
//   client
//       .verify
//       .services('VA11e80b04e286c3c556a5471fd751b1e2')
//       .verificationChecks
//       .create({
//           to:`+91${req.query.phonenumber}`,
//           code:req.query.code
//       })
//       .then((data)=>{
//           console.log(data);
//           res.status(200).send(data).json()
//       }).catch(()=>{
//           console.log("Wrong");
//       })

// })



// const jwt=require('jsonwebtoken');

// const createToken=async()=>{

//   const token=await jwt.sign({_id:"607fef3397e91392204fdc51"},"mynameisshubhampathak");
//  console.log(token);
//  const verify=await jwt.verify(token,"mynameisshubhampathak")
//  console.log(verify);
// }

// createToken();

module.exports=router;