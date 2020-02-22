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

  constructor( private docotorService : DoctorService ) { }

  ngOnInit() {
  }

  saveDoctor(doctorInformation){
    this.doctor.doctorFirstName = this.form.get("doctorFirstName").value;
    this.doctor.doctorLastName = this.form.get("doctorLastName").value;
    this.doctor.doctorId = this.form.get("doctorId").value;
    this.doctor.doctorPassword = this.form.get("doctorPassword").value;
    this.docotorService.createDoctor(this.doctor).subscribe(
      data => {
        console.log("saveDoctor data: "+JSON.stringify(data));
      },
      error => {
        console.log("saveDoctor error: "+JSON.stringify(error));
      }
    )
  }

}
