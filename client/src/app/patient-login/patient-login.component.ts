import { Router } from '@angular/router';
import { PatientService } from './../services/patient.service';
import { Patient } from '../classes/patient';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-patient-login',
  templateUrl: './patient-login.component.html',
  styleUrls: ['./patient-login.component.css']
})
export class PatientLoginComponent implements OnInit {

  private patient = new Patient();

  constructor(  private patientService : PatientService,
                private router : Router, private alertService:AlertService ) { }

  form = new FormGroup({
    patientId : new FormControl('',Validators.required),
  });

  ngOnInit() {
  }

  login(patientInformation){
    this.patient.patientId = this.PatientId.value;

    this.patientService.checkPatient(this.patient).subscribe((data)=>{
      if(!data.action){
        this.alertService.error(data.message);
      }
      else{
        localStorage.setItem('patientId',this.patient.patientId)
        this.router.navigate(['/patientConsent/'])
      }
    })
  }
  get PatientId(){
    return this.form.get('patientId');
  }

  get Password(){
    return this.form.get('password');
  }

}
