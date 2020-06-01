import { DoctorService } from '../services/doctor.service';
import { AlertService } from './../services/alert.service';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
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
  private flag2=false;
  private flag3=false;
  public patientId: string;
  form = new FormGroup({
    patientId : new FormControl('',Validators.required),
    code : new FormControl('',Validators.required)
  });
  constructor(  private doctorService : DoctorService,
                private location : Location,
                private patientService : PatientService, 
                private router : Router,
                private alertService : AlertService,
                private spinner :NgxSpinnerService,
                // private rout :RouterStateSnapshot
                private rout: ActivatedRoute
                ) { }
    

  ngOnInit() {
    this.patientId=this.rout.snapshot.url[1].path;
    // console.log("masala", this.rout.snapshot.url[1].path);
  }

  checkPatientId():number
  {
    let username=this.form.get("patientId").value;
    let patientList=JSON.parse(localStorage.getItem("patientList"));
    console.log("kalsekar chutiya banaya hai ",patientList);
    for(let i in patientList)
    {
      console.log("not inside",patientList[i]);
      if(patientList[i]==username)
      {
        console.log("inside If statement ",patientList[i]);
        return 1;
      }
    }
    return 0;
  
  } 


  sendVerificationCodeNewPatient()
  {
    let patientId=this.form.get("patientId").value;
    let checkVal=this.checkPatientId();
    console.log("Value of checkval",checkVal)
    if(checkVal==1)
    {
      console.log("Inside required shit");
      this.alertService.error("Patient Already an old patient!");
      this.flag=false;
    }
    else if(checkVal==0)
    {
      console.log("funny shit ",this.patientId);
      let doctorId=localStorage.getItem('doctorId');
      let args={patientId,doctorId};
      
      console.log("this is args ",args);
    
      this.patientService.sendOtpToPatient(args).subscribe(data=>{
        if(!data.action){
          this.alertService.error(data.message);
        }
        else{
          this.flag=true;
          
        }
      }); 
    }
  
    
  }

  sendVerificationCode(){
    
    let patientId=this.patientId;
    console.log("funny shit ",this.patientId);
    let doctorId=localStorage.getItem('doctorId');
    let args={patientId,doctorId};
    
    console.log("this is args ",args);
  
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
    // this.spinner.show();
    console.log('here');
    // return;
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
