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
mongoose.connect('mongodb+srv://m001-student:pCuWIN5JcG4JSzMO@avinash-001-q92dl.mongodb.net/blockchain?retryWrites=true&w=majority', {useNewUrlParser: true,useUnifiedTopology: true }).then(res=>console.log('connected'))
    .catch(e=>console.log(e));




app.post('/createDoctor', async (req, res) => {
    console.log('req.body: ');
    console.log(req.body);
    let doctorID = req.body.doctorID;

    //first create the identity for the voter and add to wallet
    let response = await network.registerDoctor(doctorID, req.body.firstName, req.body.lastName);
    console.log('response from registerDoctor: ');
    if (response.error) {
        res.send(response.error);
    } else {
        let networkObj = await network.connectToNetwork(doctorID);
        if (networkObj.error) {
            res.send(networkObj.error);
        }
        let args = [JSON.stringify(req.body)];

        //connect to network and update the state with doctorID  
        let invokeResponse = await network.invoke(networkObj, false, 'createDoctor', args);

        if (invokeResponse.error) {
            res.send(invokeResponse.error);
        } else {
           res.send(true);
    }
  }});

app.post('/createPatient', async (req, res) => {
  console.log('req.body: ');
  console.log(req.body);
  let patientID = req.body.patientID;

  //first create the identity for the voter and add to wallet
  let response = await network.registerPatient(patientID, req.body.firstName, req.body.lastName);
  console.log('response from registerPatient: ');
  console.log(response);
  if (response.error) {
      res.send(response.error);
  } else {
      console.log(req.body.patientID);
      let networkObj = await network.connectToNetwork(patientID);


      if (networkObj.error) {
          res.send(networkObj.error);
      }
      req.body = JSON.stringify(req.body);
      let args = [req.body];

      //connect to network and update the state with doctorID  
      let invokeResponse = await network.invoke(networkObj, false, 'createPatient', args);

      if (invokeResponse.error) {
          res.send(invokeResponse.error);
      } else {
        res.send(true);      
  }
}});


app.post('/sendOtpToPatient',async (req,res)=>{
  console.log(req.body);

  let patientID=req.body.patientID;
  let emailToSend="avinashjaiswal642@gmail.com"
  let networkObj = await network.connectToNetwork(patientID);
  let patientExist=await network.invoke(networkObj,false,'patientExists',[{"patientID":patientID}]);
  if(!patientExist){
    res.send("Patient does not exist");
}
  req.session.patientID=patientID;

  let otp=Math.floor(Math.random()*100000);
  req.session.otp=otp;

  let otpJson=new otpModel({patientID,otp});
  otpJson.save().then(e=>res.send(true));



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
    console.log(ret);
    if(ret[0].otp===otp)res.send(true);

  })
})


app.post('/checkDoctor',async (req,res)=>{
  let doctorID=req.body.doctorID;
  let networkObj = await network.connectToNetwork(doctorID);
  if(networkObj.error){res.send(false)};
  let doctorExist=await network.invoke(networkObj,false,'doctorExists',[{"doctorID":doctorID}]);
  if(!doctorExist){
    res.send(false);
}
else res.send(true);
})

app.post('/createEhr', async (req, res) => {
  let patientID=req.body.patientID;
  let doctorID=req.body.doctorID;

  let networkObj = await network.connectToNetwork(doctorID);
  if (networkObj.error) {
    res.send(networkObj.error);
  }
//   let patientExist=await network.invoke(networkObj,true,'patientExists',[{patientID}]);
//   if(!patientExist){
//     res.send(false);
// }
let args = [JSON.stringify(req.body)];
let invokeResponse = await network.invoke(networkObj,false, 'createEhr', args);
if (invokeResponse.error) {
  res.send(invokeResponse.error);
} else {
  res.send(true); 
}



});


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

app.post("/getHistoryForPatient",async (req,res)=>{
  let patientID=req.body.patientID;
  let networkObj = await network.connectToNetwork(patientID);


    if (networkObj.error) {
        res.send(networkObj.error);
    }
    let patientExist=await network.invoke(networkObj,true,'patientExists',[{patientID}]);
    if(!patientExist){
      res.send("Patient does not exist");
  }

  let args = [JSON.stringify(req.body)];
    let invokeResponse = await network.invoke(networkObj,true, 'queryByPatientID', args);
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
