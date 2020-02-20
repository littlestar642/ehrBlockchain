import { Router } from '@angular/router';
import { PatientService } from './../services/patient.service';
import { Patient } from '../classes/patient';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-login',
  templateUrl: './patient-login.component.html',
  styleUrls: ['./patient-login.component.css']
})
export class PatientLoginComponent implements OnInit {

  private patient = new Patient();

  constructor(  private patientService : PatientService,
                private router : Router ) { }

  form = new FormGroup({
    patientId : new FormControl('',Validators.required),
    password : new FormControl('',Validators.required)
  });

  ngOnInit() {
  }

  login(patientInformation){
    this.patient.patientId = this.PatientId.value;
    this.patient.patientPassword = this.Password.value;
    console.log("patientId : "+this.patient.patientId);
    console.log("patientPassword : "+this.patient.patientPassword);
    // call patientService(this.patient)
  }
  get PatientId(){
    return this.form.get('patientId');
  }

  get Password(){
    return this.form.get('password');
  }

}
