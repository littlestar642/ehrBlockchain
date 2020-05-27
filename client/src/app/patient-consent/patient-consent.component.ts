import { AlertService } from './../services/alert.service';
import { Router } from '@angular/router';
import { PatientService } from './../services/patient.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";

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
                private alertService : AlertService,
                private spinner :NgxSpinnerService ) { }

  ngOnInit() {
  }

  sendVerificationCode(){
    let patientId = this.form.get("patientId").value;
    let doctorId=localStorage.getItem('doctorId');
    let args={patientId,doctorId};
    this.patientService.sendOtpToPatient(args).subscribe(data=>{
      if(!data.action){
        this.alertService.error(data.message);
      }
      else{
        this.flag=true;
      }
    });
  }

  verifyCode(){
    this.spinner.show();
    let patientId = this.form.get("patientId").value;
    let otp = this.form.get("code").value
    let args={patientId,otp};
    console.log("pid : "+ patientId);
    console.log("otp : "+ otp);

    this.patientService.checkOtp(args).subscribe(
      res => {
        if(res){
          this.spinner.hide();
        this.alertService.success("Patient consent verified successfully !!!");
        localStorage.setItem("patientId",this.form.get("patientId").value);
        this.router.navigate(['/doctorOption/']);
        }
        else{
          this.spinner.hide();
          this.alertService.error('some error in obtaining otp');
        }
        
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
