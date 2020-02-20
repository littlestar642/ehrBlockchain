import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Doctor } from '../classes/Doctor';
import { DoctorService } from '../services/doctor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-login',
  templateUrl: './doctor-login.component.html',
  styleUrls: ['./doctor-login.component.css']
})

export class DoctorLoginComponent implements OnInit {

  private doctor = new Doctor();

  form = new FormGroup({
    doctorId : new FormControl('',Validators.required),
    password : new FormControl('',Validators.required)
  });

  constructor(  private doctorService : DoctorService,
                private router : Router ) { }

  ngOnInit() {
  }

  login(doctorInformation){

    this.doctor.docotrId = this.DoctorId.value;
    this.doctor.doctorPassword = this.Password.value;

    //call doctorService(this.doctor)

  }
  get DoctorId(){
    return this.form.get("doctorId");
  }

  get Password(){
    return this.form.get("password");
  }

}
