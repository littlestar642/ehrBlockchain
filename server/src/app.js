'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const util = require('util');
const path = require('path');
const fs = require('fs');
const uuid=require('uuid');

let network = require('./fabric/network.js');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

const configPath = path.join(process.cwd(), './config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);

//use this identity to query
const appAdmin = config.appAdmin;





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
            try{
                let parsedResponse = JSON.parse(invokeResponse);
              parsedResponse += 'doctor created';
              res.send(parsedResponse);
              }
              catch{
                let parsedResponse =invokeResponse+'doctor created';
                res.send(invokeResponse);
              }
        }
    }
});

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
        try{
            let parsedResponse = JSON.parse(invokeResponse);
          parsedResponse += 'updated doctor with new ID';
          res.send(parsedResponse);
          }
          catch{
            res.send(invokeResponse);
          }
      }
  }
});

app.post('/createEhr', async (req, res) => {
console.log(req.body);
  let patientID=req.body.patientID;
  let doctorID=req.body.doctorID;
  let networkObj = await network.connectToNetwork(doctorID);
  if (networkObj.error) {
    res.send(networkObj.error);
  }
  let patientExist=await network.invoke(networkObj,false,'patientExists',[{patientID}]);
  if(!patientExist){
    res.send("Patient does not exist");
}
let args = [JSON.stringify(req.body)];
let invokeResponse = await network.invoke(networkObj, false, 'createEhr', args);
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
    let patientExist=await network.invoke(networkObj,false,'patientExists',[{patientID}]);
  if(!patientExist){
    res.send("Patient does not exist");
}
    
    let args = [JSON.stringify(req.body)];
    let invokeResponse = await network.invoke(networkObj, false, 'updateDoctorOnEhr', args);
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

app.listen(8000, () => {
    console.log('listening at port 8000');
});
