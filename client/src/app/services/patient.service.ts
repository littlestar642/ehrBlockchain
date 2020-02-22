import { Ehr } from './../classes/ehr';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ObserveOnMessage } from 'rxjs/internal/operators/observeOn';
@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private baseUrl = "http://localhost:8000/";

  constructor( private http : HttpClient) { }

  createPatient(args:any):Observable<any>{
    let newObj={patientID:"",firstName:"",lastName:""};
    newObj.patientID=args.patientId;
    newObj.firstName=args.patientFirstName;
    newObj.lastName=args.patientLastName;
    let url = this.baseUrl + "createPatient";
    return this.http.post(url,newObj).pipe(
      tap(resp=>{
        console.log(resp);
      })
    )
  }

  sendOtpToPatient(patientID:string):Observable<any>{
    console.log('clicked')
    let url = this.baseUrl + "sendOtpToPatient";
    console.log(url); 
    console.log(patientID);
    return this.http.post(url,{patientID}).pipe(tap(resp=>{console.log(resp)}));
}

  checkOtp(otp:string):Observable<any>{
    let url = this.baseUrl + "checkOtp";
    return this.http.post(url,otp).pipe(tap(resp=>{console.log(resp)}));
  }
}