import { AlertService } from './../services/alert.service';
import { Router } from '@angular/router';
import { PatientService } from './../services/patient.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-patient-consent',
  templateUrl: './patient-consent.component.html',
  styleUrls: ['./patient-consent.component.css']
})
export class PatientConsentComponent implements OnInit {

  private flag = false;
  form = new FormGroup({
    patientId : new FormControl('',Validators.required),
    code : new FormControl('',Validators.required)
  });
  constructor(  private location : Location,
                private patientService : PatientService, 
                private router : Router,
                private alertService : AlertService ) { }

  ngOnInit() {
  }

  sendVerificationCode(){
    let patientId = this.form.get("patientId").value;
    this.patientService.sendOtpToPatient(patientId).subscribe(res=>console.log(res));
    //service to send req for otp.
  }

  verifyCode(){
    let patientId = this.form.get("patientId").value;
    let otp = this.form.get("code").value
    console.log("pid : "+ patientId);
    console.log("otp : "+ otp);

    this.patientService.checkOtp(otp).subscribe(
      res => {
        console.log("verifyCode res : "+JSON.stringify(res));
        this.alertService.success("Patient consent verified successfully !!!");
        localStorage.setItem("patientId",this.form.get("patientId").value);
        this.router.navigate(['/doctorOption']);
      },
      error => {
        console.log("verifyCode error : "+JSON.stringify(error));
        this.alertService.error("error while checking otp :(");
      }
    );
    //service to verifiy
    // this.doctorService.verifyPatient(patientId,otp).subscribe(
    //   data=>{
    //     console.log(" patient consent resp : "+JSON.stringify(data));
    //     //localStorage.setItem("patientId",this.form.get("patientId").value);
    //     //this.router.navigate(['/doctorOption']);
    //   },
    //   error=>{
    //     console.log(" patient consent error : "+JSON.stringify(error));
    //   }
    // )
    // if success redirect to next DoctorOption
    //if fail same page
  }

  goBack(){
    this.location.back();
  }

}
