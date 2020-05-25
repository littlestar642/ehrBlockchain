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
              res.send({action:true,message:"succesfully created doctor"})
            }
    }
  }});

app.post('/createPatient', async (req, res) => {
 
  let doctorId=req.body.doctorId;
  let args=req.body;
  args=JSON.parse(JSON.stringify(args));

  // let response = await network.registerPatient(patientId, args.firstName, args.lastName);
  // console.log('response from registerPatient: ');
  // if (response.error) {
  //   res.send({action:false,message:"error in patient registration"});
  // } else {

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
    });


app.post('/checkDoctor',async (req,res)=>{
  let args=req.body;
  args=JSON.parse(JSON.stringify(args));


  let networkObj = await network.connectToNetwork(args.doctorId);
  if(networkObj.error){res.send({action:false,message:"could not find doctor"})};
  let doctorExist=await network.invoke(networkObj,true,'doctorExists',[args]);
  console.log(doctorExist.toString());
  if(doctorExist.toString()=="false"){
    res.send({action:false,message:"doctor is not registered in blockchain"});
  }
  else if(doctorExist.toString()=="true"){
    res.send({action:true,message:"successfully fetched doctor"});
  } 
  else{
    res.send({action:false,message:"error due to unknown reasons"})
  }
});

app.post('/checkPatient',async (req,res)=>{
  let args=req.body;
  args=JSON.parse(JSON.stringify(args));
  
  let networkObj = await network.connectToNetwork(args.doctorId);
  if(networkObj.error){res.send({action:false,message:"could not find doctor"})};
  let patientExist=await network.invoke(networkObj,true,'patientExists',[args]);
  if(patientExist.toString()=="false"){
    res.send({action:false,message:"patient is not registered in blockchain"});
  }
  else if(patientExist.toString()=="true"){
    res.send({action:true,message:"successfully fetched patient"});
  } 
  else{
    res.send({action:false,message:"error due to unknown reasons"})
  }
})


app.post('/sendOtpToPatient',async (req,res)=>{

  let patientId=req.body.patientId;
  let doctorId=req.body.doctorId;
  let args=req.body;
  args=JSON.parse(JSON.stringify(args));

  let emailToSend="avinashjaiswal642@gmail.com"
  let networkObj = await network.connectToNetwork(doctorId);
  if(networkObj.error){res.send({action:false,message:"could not find doctor"})};
  let patientExist=await network.invoke(networkObj,false,'patientExists',[args]);
  if(patientExist.toString()=="false"){
    res.send({action:false,message:"patient is not registered in blockchain"});
  }
  else if(patientExist.toString()=="true"){
    req.session.patientId=patientId;

  let otp=Math.floor(Math.random()*100000);
  req.session.otp=otp;

  let otpJson=new otpModel({patientId,otp});
  otpJson.save().then(e=>{
    res.send({action:true,message:"successfully fetched patient"});
  });
  } 
  else{
    res.send({action:false,message:"error due to unknown reasons"})
  }
  



  // let emailToSend=req.body.email;
  // var transporter = nodemailer.createTransport({
  //   host:"smtp.gmail.com",
  //   auth: {
  //     user: 'doctordappapp@gmail.com',
  //     pass: 'doctordap123'
  //   },
  //   secure:false,
  //   port:587
  // });
  
  // var mailOptions = {
  //   from: 'doctordappapp@gmail.com',
  //   to: `${emailToSend}`,
  //   subject: 'Your OTP for logging into doctor dap is',
  //   text: `${otp}`
  // };
  
  // transporter.sendMail(mailOptions, function(error, info){
  //   if (error) {
  //     console.log(error);
  //     res.send(error);
  //   } else {
  //     res.send('Email sent: ' + info.response);
  //   }
  // });
});

app.post('/checkOtp',(req,res)=>{
  let patientID=req.body.patientID;
  let otp=req.body.otp;
  otpModel.find({patientID}).then(ret=>{
    if(ret[0].otp===otp)res.send(true);
    else res.send(false);
  })
})




app.post('/createEhr', async (req, res) => {
  let patientId=req.body.patientId;
  let doctorId=req.body.doctorId;
  let args=req.body;
  let ehrId=req.body.ehrId;
  args=JSON.parse(JSON.stringify(args));
  fs.writeFileSync('yewalajson.txt',JSON.stringify(args));
  
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
