import { Router } from '@angular/router';
import { DoctorService } from './../services/doctor.service';
import { User } from './../classes/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-onboarding',
  templateUrl: './patient-onboarding.component.html',
  styleUrls: ['./patient-onboarding.component.css']
})
export class PatientOnboardingComponent implements OnInit {

  title = "forms";
  userModel = new User('random','rob@gm.com',1234567890,123456);
  
  constructor(  private doctorService : DoctorService,
                private router : Router ) { }

  ngOnInit() {
  }

  sendData(){
    console.log("name : "+this.userModel.name);
    //service to send this data
    this.doctorService.addPatient(this.userModel).subscribe(
      data => {
        console.log(" patient onboarding -> sendData : "+JSON.stringify(data));
        this.router.navigate(['/doctorHome/1']);
      },
      error => {
        console.log(" patient onboarding -> sendData error : "+JSON.stringify(error));
      }
    )
  }

}
