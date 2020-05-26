import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DoctorService } from '../services/doctor.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate{

  constructor( private doctorService : DoctorService, private router : Router) { }

  canActivate(){
    if(!this.doctorService.isLoggedIn()){
      this.router.navigate(['/doctorLogin'])
      return false;
    }
    return true;    
  }
}
