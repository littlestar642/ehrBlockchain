import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';

@Component({
  selector: 'app-doctor-home',
  templateUrl: './doctor-home.component.html',
  styleUrls: ['./doctor-home.component.css']
})
export class DoctorHomeComponent implements OnInit {

  isLoggedIn: boolean;
  
  constructor( private doctorService : DoctorService ) { 
  }

  ngOnInit() {
    this.isLoggedIn = this.doctorService.isLoggedIn();
  }

  logout(){
    this.doctorService.logout();
  }

}
