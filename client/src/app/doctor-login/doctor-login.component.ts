import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Doctor } from '../classes/Doctor';
import { DoctorService } from '../services/doctor.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { SHA256, enc } from "crypto-js";

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
                private router : Router, private alertService:AlertService ) { }

  ngOnInit() {
  }

  login(doctorInformation){

    this.doctor.doctorId = this.DoctorId.value;
    const hashedPass = SHA256(this.Password.value).toString(enc.Hex);
    this.doctor.doctorPassword = hashedPass;
    this.doctorService.checkDoctor(this.doctor).subscribe((data)=>{
      if(!data.action){
        this.alertService.error(data.message);
      }
      else{
        localStorage.setItem('doctorId',this.doctor.doctorId);
        localStorage.setItem('token',data.token);
        this.router.navigate(['/doctorHome/'+this.doctor.doctorId]);
      }
    })

  }
  get DoctorId(){
    return this.form.get("doctorId");
  }

  get Password(){
    return this.form.get("password");
  }

}
