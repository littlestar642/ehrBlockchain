'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const util = require('util');
const path = require('path');
const fs = require('fs');
const uuid=require('uuid');
const nodemailer=require('nodemailer');
const mongoose=require('mongoose');
const jwt = require("jsonwebtoken");
const {v4} =require('uuid')

const jwtKey = "secret_key"
const jwtExpirySeconds = 3000

let fromMail = 'doctordappapp@gmail.com';

let subject  = 'Otp for login';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'doctordappapp@gmail.com',
      pass: 'doctordap123'
  }
});


let network = require('./fabric/network.js');

const app = express();
var session = require('express-session')
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.set('trust proxy', 1)
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

const configPath = path.join(process.cwd(), './config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);

//use this identity to query
const appAdmin = config.appAdmin;



const otpModel=require("./models/otp");
mongoose.connect('mongodb+srv://m001-student:mBVI3SbOLiX22EPT@avinash-001-q92dl.mongodb.net/blockchain?retryWrites=true&w=majority', {useNewUrlParser: true,useUnifiedTopology: true }).then(res=>console.log('connected'))
    .catch(e=>console.log(e));

// Code for sending email
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


function generateToken(doctorId){
  let token = jwt.sign({ doctorId }, jwtKey, {
		algorithm: "HS256",
		expiresIn: jwtExpirySeconds,
	});
	console.log("token: ", token);
  return String(token);
}

app.post('/createDoctor', async (req, res) => {
    let args=req.body;
    let doctorId = req.body.doctorId;
    args=JSON.parse(JSON.stringify(args));


    let response = await network.registerDoctor(doctorId, args.firstName, args.lastName, args.password);
    console.log('response from registerDoctor: ');
    if (response.error) {
        res.send({action:false,message:"error in doctor registration"});
    } else {
        let networkObj = await network.connectToNetwork(doctorId);
        if (networkObj.error) {
            res.send({action:false,message:"error in connecting to network"});
        }

        let invokeResponse = await network.invoke(networkObj, false, 'createDoctor', [args]);
        if (invokeResponse.error) {
            res.send({action:false,message:"error in invoking chaincode"});
        } else {
            if(invokeResponse.toString()=="false"){
              res.send({action:false,message:"doctor already exists"});
            }
            else{
              let token = generateToken(doctorId);
              res.send({action:true,message:"succesfully created doctor", token:token});
            }
    }
  }});

app.post('/createPatient', async (req, res) => {
 
  let doctorId=req.body.doctorId;
  let args=req.body;
  let patientId=req.body.patientId;
  args=JSON.parse(JSON.stringify(args));

  let response = await network.registerPatient(patientId, args.firstName, args.lastName);
  console.log('response from registerPatient: ');
  if (response.error) {
    res.send({action:false,message:"error in patient registration"});
  } else {
    
      let networkObj = await network.connectToNetwork(doctorId);
      if (networkObj.error) {
        res.send({action:false,message:"error in connecting to network"});
      }

      let invokeResponse = await network.invoke(networkObj, false, 'createPatient', [args]);
        if (invokeResponse.error) {
            res.send({action:false,message:"error in invoking chaincode"});

        } else {
            if(invokeResponse.toString()=="false"){
              res.send({action:false,message:"patient already exists"});
            }
            else{
              res.send({action:true,message:"succesfully created patient"})
            }
      }
    }
    });


app.post('/checkDoctor',async (req,res)=>{
  let args=req.body;
  args=JSON.parse(JSON.stringify(args));


  let networkObj = await network.connectToNetwork(args.doctorId);
  if(networkObj.error){res.send({action:false,message:"could not find doctor"})};
  let doctorExist=await network.invoke(networkObj,true,'checkDoctorPass',[args]);
  if (doctorExist.error) {res.send({action:false,message:"wrong credentials"});}

  if(doctorExist.toString()=="false"){
    res.send({action:false,message:"wrong credentials"});
  }
  else if(doctorExist.toString()=="true"){
    let token = generateToken(args.doctorId);
    res.send({ action:true, message:"successfully fetched doctor", token:token });
  } 
  else{
    res.send({action:false,message:"error due to unknown reasons"})
  }
});

app.post('/checkPatient',async (req,res)=>{
  let args=req.body;
  args=JSON.parse(JSON.stringify(args));
  
  let networkObj = await network.connectToNetwork(args.patientId);
  if(networkObj.error){res.send({action:false,message:"could not find doctor"})};
  let patientExist=await network.invoke(networkObj,true,'patientExists',[args]);
  if (patientExist.error) {res.send({action:false,message:"wrong credentials"});}
  if(patientExist.toString()=="false"){
    res.send({action:false,message:"patient is not registered in blockchain"});
  }
  else if(patientExist.toString()=="true"){
    res.send({action:true,message:"successfully fetched patient"});
  } 
  else{
    res.send({action:false,message:"error due to unknown reasons"})
  }
});

app.post('/checkUsernamePresence',async (req,res)=>{
  let args=req.body;
  args=JSON.parse(JSON.stringify(args));
  
  let networkObj = await network.connectToNetwork(args.id);
  if(networkObj.error){res.send({action:true,message:"username available"})};
  let userExist=await network.invoke(networkObj,true,'checkUsernamePresence',[args]);
  if (userExist.error) {res.send({action:false,message:"wrong credentials"});}
  let user=JSON.parse(userExist.toString());
  if(user.doctorId){
    res.send({action:false,message:"username already used"});
  }
  else{
    res.send({action:true,message:"username available"});
  } 
});



app.post('/checkPatientPassword',async (req,res)=>{
  let patientId=req.body.patientId;
  let args=JSON.parse(JSON.stringify(req.body));
  console.log(args);
  let networkObj = await network.connectToNetwork(patientId);
  if(networkObj.error){res.send({action:false,message:"could not find doctor"})};

  let patientExist=await network.invoke(networkObj,true,'checkPatientPassword',[args]);
  if (patientExist.error) {res.send({action:false,message:"wrong credentials"});}

  if(patientExist.toString()=="false"){
    res.send({action:false,message:"password entered is wrong"});
  }
  else if(patientExist.toString()=="true"){
    res.send({action:true,message:"successfully fetched password"});
  } 
  else{
    res.send({action:false,message:"error due to unknown reasons"})
  }
  
})


app.post('/sendOtpToPatient',async (req,res)=>{
  let patientId=req.body.patientId;
  let args=req.body;
  let doctorId=req.body.doctorId;

  let networkObj = await network.connectToNetwork(doctorId);
  if(networkObj.error){res.send({action:false,message:"could not find patient"})};
  let patientM=await network.invoke(networkObj,true,'getMailIdOfPatient',[args]);
  if(!patientM.toString()){
    res.send({action:false,message:"some error occured"});
  }
  else{
    let patientMail=patientM.toString();
    let otp=Math.floor(Math.random()*100000);
    let mailOptions = {
      from: fromMail,
      to: patientMail,
      subject: subject,
      text: `The otp for the present session is ${otp}`
    };

      otpModel.findOne({patientId}).then(resp1=>{
        if(!resp1){
          let otpJson=new otpModel({patientId,otp});
          otpJson.save().then(()=>{
            transporter.sendMail(mailOptions, (error, response) => {
              if (error) {
              res.send({action:false,message:"error occured in sending mail "+ error})
              }
              res.send({action:true,message:"mail sent successfully"})
            });
          }).catch(e=>{
              res.send({action:false,message:"error occured in sending mail "+ e})
          })
        }
        else{
          resp1.otp=otp;
          otpModel.findOneAndUpdate({patientId},resp1).then(()=>{
            transporter.sendMail(mailOptions, (error, response) => {
              if (error) {
              res.send({action:false,message:"error occured in sending mail "+ error})                  
              }
              res.send({action:true,message:"mail sent successfully"})
            });
          }).catch(e=>{
            res.send({action:false,message:"error occured in sending mail "+ e})
        })
        }
      })

  }
});

app.post('/generateOtp',async (req,res)=>{


  let patientId=req.body.patientId;
  let args=req.body;

  let networkObj = await network.connectToNetwork(patientId);
  if(networkObj.error){res.send({action:false,message:"could not find patient"})};
  let patientM=await network.invoke(networkObj,true,'getMailIdOfPatient',[args]);
  if(!patientM.toString()){
    res.send({action:false,message:"some error occured"});
  }
  else{
    let patientMail=patientM.toString();
    let otp=Math.floor(Math.random()*100000);
    let mailOptions = {
      from: fromMail,
      to: patientMail,
      subject: subject,
      text: `The otp for the present session is ${otp}`
    };

      otpModel.findOne({patientId}).then(resp1=>{
        if(!resp1){
          let otpJson=new otpModel({patientId,otp});
          otpJson.save().then(()=>{
            transporter.sendMail(mailOptions, (error, response) => {
              if (error) {
              res.send({action:false,message:"error occured in sending mail "+ error})
              }
              res.send({action:true,message:"mail sent successfully"})
            });
          }).catch(e=>{
              res.send({action:false,message:"error occured in sending mail "+ e})
          })
        }
        else{
          resp1.otp=otp;
          otpModel.findOneAndUpdate({patientId},resp1).then(()=>{
            transporter.sendMail(mailOptions, (error, response) => {
              if (error) {
              res.send({action:false,message:"error occured in sending mail "+ error})                  
              }
              res.send({action:true,message:"mail sent successfully"})
            });
          }).catch(e=>{
            res.send({action:false,message:"error occured in sending mail "+ e})
        })
        }
      })

  }
})

app.post('/checkOtp',(req,res)=>{
  let patientId=req.body.patientId;
  let otp=req.body.otp;

  console.log(req.body);
  otpModel.findOne({patientId}).then(resp1=>{
    if(resp1.otp===otp){
      res.send({action:true,message:"correct otp provided"});
    }
    else{
      res.send({action:false,message:"incorrect otp provided"})      
    }
  })
})


app.post('/patientHasPassword',async (req,res)=>{
  let patientId=req.body.patientId;
  let args=JSON.parse(JSON.stringify(req.body));
  let networkObj = await network.connectToNetwork(patientId);
  if(networkObj.error){res.send({action:false,message:"could not find patient"})};

  let patientExist=await network.invoke(networkObj,true,'patientHasPassword',[args]);

  if(patientExist.toString()=="false"){
    res.send({action:false,message:"no password set"});
  }
  else if(patientExist.toString()=="true"){
    res.send({action:true,message:"successfully set password"});
  } 
  else{
    res.send({action:false,message:"error due to unknown reasons"})
  }
  
})

app.post('/setPatientPassword',async (req,res)=>{
  let patientId=req.body.patientId;
  let args=JSON.parse(JSON.stringify(req.body));

  let networkObj = await network.connectToNetwork(patientId);
  if(networkObj.error){res.send({action:false,message:"could not find patient"})};
  console.log(args);
  let patientExist=await network.invoke(networkObj,false,'setPatientPassword',[args]);

  if(patientExist.toString()=="false"){
    res.send({action:false,message:"password entered is wrong"});
  }
  else if(patientExist.toString()=="true"){
    res.send({action:true,message:"successfully set password"});
  } 
  else{
    res.send({action:false,message:"error due to unknown reasons"})
  }
  
})






app.post('/createEhr', async (req, res) => {
  let patientId=req.body.patientId;
  let doctorId=req.body.doctorId;
  let args=req.body;
  let ehrId=v4()
  args=JSON.parse(JSON.stringify(args));
  args.ehrId=ehrId;
  fs.writeFileSync('yewalajson.txt',JSON.stringify(args));
  console.log(args);
  let networkObj = await network.connectToNetwork(doctorId);
  if(networkObj.error){res.send({action:false,message:"could not find doctor"})};


  let invokeResponse = await network.invoke(networkObj,false,'createEhr',[args]);
  if (invokeResponse.error) {
      res.send({action:false,message:"error in invoking chaincode"});

  } else {
      if(invokeResponse.toString()=="true")
      res.send({action:true,message:"succesfully created ehr"})
      else{
      res.send({action:false,message:"some error occured"})
      }
  }




});

app.post("/getHistoryForPatient",async (req,res)=>{
  let patientId=req.body.patientId;
  let doctorId=req.body.doctorId;
  let networkObj = await network.connectToNetwork(doctorId);
  if(networkObj.error){res.send({action:false,message:"could not find doctor"})};


  let args =JSON.parse(JSON.stringify(req.body));
    let invokeResponse = await network.invoke(networkObj,true,'queryByPatientID',[args]);
    if (invokeResponse.error) {
      res.send({action:false,message:"could not invoke chaincode"})
  } else {
    res.send({action:true,message:invokeResponse.toString()})
      
  }
})


app.post('/updateDoctor', async (req, res) => {
    let newDoctorID = req.body.doctorID;
    let patientID=req.body.patientID;
    console.log(newDoctorID)
    console.log(patientID)


    let networkObj = await network.connectToNetwork(newDoctorID);


    if (networkObj.error) {
        res.send(networkObj.error);
    }
    let patientExist=await network.invoke(networkObj,true,'patientExists',[{patientID}]);
  if(!patientExist){
    res.send("Patient does not exist");
}
    
    let args = [JSON.stringify(req.body)];
    let invokeResponse = await network.invoke(networkObj,false, 'updateDoctorOnEhr', args);
    if (invokeResponse.error) {
      res.send(invokeResponse.error);
  } else {
      console.log('after network.invoke ');
      try{
        let parsedResponse = JSON.parse(invokeResponse);
      parsedResponse += 'updated doctor with new ID';
      res.send(parsedResponse);
      }
      catch{
        res.send(invokeResponse);
      }
      
  }


})


app.post('/getOtp',(req,res)=>{
  let patientID=req.body.patientID;
  otpModel.find({patientID}).then(ret=>{
    res.send(ret.otp);
  })
})

app.listen(8000, () => {
    console.log('listening at port 8000');
});
