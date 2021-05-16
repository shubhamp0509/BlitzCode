const express=require('express')
// var router=express.Router()
const ObjectId=require('mongoose').Types.ObjectId;
// const Regist=require('../models/registration');
// const profile=require("../models/profile");
const bodyParser = require('body-parser')
const Flog=require('../models/userInfo');
const Member=require('../models/MemberInfos');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const accountSid = 'ACe2e0534b44d8f7bcdcf10bc80e3274b0'; 
const authToken = 'c64c237669885d8787e3625ec4fa01bc'; 
const client = require('twilio')(accountSid, authToken); 
const {format} = require('util');
const gc = require('../config/')
const bucket = gc.bucket('profile_pic123')
var multer  = require('multer')


const path = require("path"); 
const router = express()
const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    // no larger than 5mb.
    fileSize: 5 * 1024 * 1024,
  },
})

router.disable('x-powered-by')
router.use(multerMid.single('file'))
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: false}))




// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/uploads')
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now()+file.originalname )
//   }
// })

// const fileFilter=(req,file,cb)=>{
//   if(file.mimetype==='image/jpeg' || file.mimetype==='image/jpg' || file.mimetype==='image/png'){
//     cb(null,true)
//   }else{
//     cb(null,false)
//   }

// }

// var upload = multer({ storage:storage,limits: {
//   // Setting Image Size Limit to 2MBs
//   fileSize: 2000000
// },fileFilter:fileFilter

// });





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

 router.post('/',async(req,res)=>{

    console.log("Callaed"+req.body.username);
  
       
    try{
     
      const mobile=req.body.username
     const password=req.body.password
  
    var useremail=await Flog.findOne({mobile:mobile})
    if(useremail==null){
      return res.send({msg:"Unathorised user"});
  
    }
      
    const isMatch=password==useremail.password
    console.log("Password"+isMatch);
    //   const isMatch=await bcrypt.compare(password,useremail.password)
      const token =await useremail.generateAuthToken()
      
  
    if(isMatch){
      console.log("Correct password and email matched");
      
      return res.send({token:token,mobile:mobile});
     
    }else{
    // console.log("password is wrong")
    return res.send({msg:"Unathorised user"});
    }
  
      
      
  
    }catch(err){
      res.status(400).send(err)
  
    }
  
  })



router.get('/SendOtp',(req,res)=>{
      console.log("call"+req.query.phonenumber)
    
      client
          .verify
          .services('VA6281120ca5ab52e4751ba82ab26fdfba')
          .verifications
          .create({
              to:`+91${req.query.phonenumber}`,
              channel:req.query.channel
          })
              .then((data)=>{
                  res.status(200).send(data)
              }).catch((err)=>{
                res.status(401).send(err);
    
              })
    });
    
    router.get('/verify', (req,res)=>{
        client
        .verify
        .services('VA6281120ca5ab52e4751ba82ab26fdfba')
        .verificationChecks
        .create({
            to:`+91${req.query.phonenumber}`,
            code:req.query.code
        })
        .then(async (data)=>{
            rec=new Flog({mobile:req.query.phonenumber})
            const token = await rec.generateAuthToken()
            console.log(token);
            const v=  rec.save();
            console.log(data);
            return res.send({token,data});
           
           
        }).catch(()=>{
            console.log("Wrong");
        })
    
    })

    router.post('/registration',async(req,res)=>{
        console.log("Registration call");
        const mobile=req.body.phone
       result= await Flog.findOne({mobile:mobile})
       console.log(result);
       const user={
           fName:req.body.fullname,
           wardName:req.body.wardName,
           email:req.body.address,
           dob:req.body.dob,
           gender:req.body.gender,
           bloodGroup:req.body.blood,
           profeesion:req.body.profession,
           password:req.body.password,
           mobile:req.body.phone,
           isRegistered:true,
          

       }
    //   const val= Flog.findOneAndUpdate({mobile:mobile},{$set :user});

    Flog.findOneAndUpdate({mobile:mobile},{$set :user},{new:true},(err,doc)=>{
    
        if(!err)
             res.send(doc)
             else
             console.log("Error in Task Updated");
         });


      
    //    await user.save();
    //    console.log(val);
    })

    router.get('/:mobile',(req,res)=>{
  
        Flog.findOne({mobile:req.params.mobile},(err,doc)=>{
                 if(!err){
                //  console.log("in get call login")
                //  console.log(doc);
                 res.send(doc)
                 }
                 else
                 console.log('Error in retriving');
   
         })

   
   })


   router.get('/member/getMember:mobile', (req,res)=>{
     
     const mobile=req.params.mobile
     console.log("Hello"+mobile.split(':')[1])
  
     
    
        Flog.findOne({mobile:mobile.split(':')[1]},(err,doc)=>{
                if(!err){
                    
                    Member.find({
                        '_id': { $in: 
                            // mongoose.Types.ObjectId('605c714992d24a7b04e2e1bc'),
                            doc.memberList
                            
                            
                        }
                    }, function(err, docs){
                        
                        res.send(docs)
                       
                    });

                      

                    // res.json(doc.tests)
                }
                // res.json(doc.tests)
                else
                console.log('Error in retriving');

        })



})







   router.post("/addMember:mobile",async function(req, res) {
    
                console.log("with id call"+req.params.mobile);
                console.log(req.body.fullname);
                const mobile=req.params.mobile
                console.log(mobile.split(':')[1])

              rec=new Member({
                fName:req.body.fullname,
                email:req.body.address,
                dob:req.body.dob,
                gender:req.body.gender,
                bloodGroup:req.body.blood,
                profeesion:req.body.profession,
                relation:req.body.relation,
                mobile:req.body.phone


   })

//    console.log("Id:"+req.params.id);


await new Member(rec).save().then((dbTest)=>{
     console.log(dbTest._id);
   Flog.findOneAndUpdate({mobile:mobile.split(':')[1]},{$push:{memberList:dbTest._id}},(err,doc)=>{
   
       if(!err)
          //  console.log("No Error");
             res.send(doc.memberList)
            else
            console.log("Error in Task Updated");
        });
      

});

});
// upload.single('profile_pic')
router.post('/imagePost/:mobile',async(req,res,next)=>{

  console.log("mobile:"+req.params.mobile)
  
console.log(req.file)
  try {

    const myFile = req.file
    // uploadImage.fun()
    const imageUrl = await uploadImage(myFile)

    Flog.findOneAndUpdate({mobile:req.params.mobile},{profileImage :imageUrl},{new:true},(err,doc)=>{
    
      if(!err){
        res
        .status(200)
        .json({
          message: "Upload was successful",
          data: imageUrl
        })
      }
      
           
       });

    // console.log(imageUrl)
   
  } catch (error) {
    next(error)
  }
   
  





})

const uploadImage = (file) => new Promise((resolve, reject) => {

  console.log("uploadImage")
const { originalname, buffer } = file

const blob = bucket.file(originalname.replace(/ /g, "_"))
const blobStream = blob.createWriteStream({
  resumable: false
})
blobStream.on('finish', () => {
  const publicUrl = format(
    `https://storage.googleapis.com/${bucket.name}/${blob.name}`
  )
  resolve(publicUrl)
})
.on('error', () => {
  reject(`Unable to upload image, something went wrong`)
})
.end(buffer)
})


router.use((err, req, res, next) => {
  res.status(500).json({
    error: err,
    message: 'Internal server error!',
  })
  next()
})
   






module.exports=router;