import { Router } from '@angular/router';
import { AlertService } from './../services/alert.service';
import { DoctorService } from './../services/doctor.service';
import { Doctor } from '../classes/Doctor';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';  

@Component({
  selector: 'app-doctor-registration',
  templateUrl: './doctor-registration.component.html',
  styleUrls: ['./doctor-registration.component.css']
})

export class DoctorRegistrationComponent implements OnInit {
  
  private doctor = new Doctor();

  form = new FormGroup({
    doctorFirstName : new FormControl('',Validators.required),
    doctorLastName : new FormControl('',Validators.required),
    doctorId : new FormControl('',Validators.required),
    doctorPassword : new FormControl('',Validators.required)
  })

  constructor(  private docotorService : DoctorService,
                private alertService : AlertService,
                private router : Router ) { }

  ngOnInit() {
  }

  saveDoctor(doctorInformation){
    this.doctor.doctorFirstName = this.form.get("doctorFirstName").value;
    this.doctor.doctorLastName = this.form.get("doctorLastName").value;
    this.doctor.doctorId = this.form.get("doctorId").value;
    this.doctor.doctorPassword = this.form.get("doctorPassword").value;
    console.log(this.doctor);
    this.docotorService.createDoctor(this.doctor).subscribe(
      data => {
        if(!data.action){
          this.alertService.error(data.message);
        }
        else{
        this.alertService.success("doctor registered successfully !!!");
        console.log("saveDoctor data: "+JSON.stringify(data));
        localStorage.setItem("doctorId",this.doctor.doctorId);
        this.router.navigate(['/doctorHome/'+this.doctor.doctorId]);
        }

      }
    )
  }

}
