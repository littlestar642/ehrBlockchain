import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
<<<<<<< HEAD
=======
import { AlertService } from '../services/alert.service';
>>>>>>> d2181d180d3e76a570b152a9cb8c2e26f58d8518

@Component({
  selector: 'app-doctor-home',
  templateUrl: './doctor-home.component.html',
  styleUrls: ['./doctor-home.component.css']
})
export class DoctorHomeComponent implements OnInit {

  isLoggedIn: boolean;
  
  constructor( private doctorService : DoctorService,
               private spinner : NgxSpinnerService,
<<<<<<< HEAD
               private router : Router ) { 
=======
               private router : Router,
               private alertService:AlertService ) { 
>>>>>>> d2181d180d3e76a570b152a9cb8c2e26f58d8518
  }

  ngOnInit() {
    
    this.isLoggedIn = this.doctorService.isLoggedIn();
    this.getPatientsAlignedToDoctor()
  }

<<<<<<< HEAD
=======
  getPatientsAlignedToDoctor(){
    let doctorId=localStorage.getItem('doctorId');
    this.doctorService.getPatientsAlignedToDoctor(doctorId).subscribe((data)=>{
      if(!data.action){
        this.alertService.error(data.message);
      }
      else{
        console.log(data.message);
      }
    });
  }

>>>>>>> d2181d180d3e76a570b152a9cb8c2e26f58d8518
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
