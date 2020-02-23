import { AlertService } from './../services/alert.service';
import { Patient } from './../classes/patient';
import { Router } from '@angular/router';
import { PatientService } from './../services/patient.service';
import { User } from './../classes/user';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';  

@Component({
  selector: 'app-patient-onboarding',
  templateUrl: './patient-onboarding.component.html',
  styleUrls: ['./patient-onboarding.component.css']
})
export class PatientOnboardingComponent implements OnInit {

  title = "forms";
  //userModel = new User('random','rob@gm.com',1234567890,123456);
  private patient = new Patient();  
  
  form = new FormGroup({
    patientFirstName : new FormControl('',Validators.required),
    patientLastName : new FormControl('',Validators.required),
    patientId : new FormControl('',Validators.required),
    patientPassword : new FormControl('',Validators.required)
  })

  constructor(  private patientService : PatientService,
                private router : Router,
                private alertService : AlertService ) { }

  ngOnInit() {
  }

  savePatient(patientInormation){
    this.patient.patientFirstName = this.form.get("patientFirstName").value;
    this.patient.patientLastName = this.form.get("patientLastName").value;
    this.patient.patientId = this.form.get("patientId").value;
    this.patient.patientPassword = this.form.get("patientPassword").value;
    console.log("name : "+JSON.stringify(this.patient));
    //service to send this data
    this.patientService.createPatient(this.patient).subscribe(
      data => {
        console.log(" patient onboarding -> sendData : "+JSON.stringify(data));
        this.alertService.success("Patient onboarded successfully !!!");
        localStorage.setItem("patientId",this.patient.patientId);
        this.router.navigate(['/doctorHome/'+localStorage.getItem("doctorId")]);
      },
      error => {
        console.log(" patient onboarding -> sendData error : "+JSON.stringify(error));
        this.alertService.error("Patient onboarding failed :(");
      }
    )
  }

}
