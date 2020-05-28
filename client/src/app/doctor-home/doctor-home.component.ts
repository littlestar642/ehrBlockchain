import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-home',
  templateUrl: './doctor-home.component.html',
  styleUrls: ['./doctor-home.component.css']
})
export class DoctorHomeComponent implements OnInit {

  isLoggedIn: boolean;
  
  constructor( private doctorService : DoctorService,
               private spinner : NgxSpinnerService,
               private router : Router ) { 
  }

  ngOnInit() {
    
    this.isLoggedIn = this.doctorService.isLoggedIn();
  }

  startSpin1(){
      
      this.spinner.show();
      setTimeout(() => {
        //spinner ends after 2 seconds 
          this.spinner.hide();
          this.router.navigate(['/patientOnboarding/']);
        }, 2000);               
  }
  startSpin2(){
      
    this.spinner.show();
    setTimeout(() => {
      //spinner ends after 2 seconds 
        this.spinner.hide();
        this.router.navigate(['/patientConsent/']);
      }, 2000);               
}


  logout(){   
    
    this.doctorService.logout();
    this.spinner.show();
    setTimeout(() => {
      //spinner ends after 2 seconds 
        this.spinner.hide();
      }, 2000);              
    
  }

}
