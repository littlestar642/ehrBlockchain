import { Ehr } from './../classes/ehr';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, Subscribable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ObserveOnMessage } from 'rxjs/internal/operators/observeOn';
@Injectable({
  providedIn: 'root'
})
export class PatientService {


  checkPatient(patient:any) : Subscribable<any>{
    let url = this.baseUrl + "checkPatient";
    let headers=new HttpHeaders();
    let newObj={"patientId":"","doctorId":""}
    newObj.patientId=patient.patientId;
    newObj.doctorId=localStorage.getItem('doctorId');
    headers.set('Content-Type','application/json');
    return this.http.post<any>(url,JSON.parse(JSON.stringify(newObj)),{headers:headers});
  }
  private baseUrl = "http://localhost:8000/";

  constructor( private http : HttpClient) { }

  createPatient(args:any):Observable<any>{
    let newObj={"patientId":"","firstName":"","lastName":"","doctorId":""};
    newObj.patientId=args.patientId;
    newObj.firstName=args.patientFirstName;
    newObj.lastName=args.patientLastName;
    newObj.doctorId=args.doctorId;
    let url = this.baseUrl + "createPatient";
    let headers = new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(JSON.stringify(newObj)))
  }

  sendOtpToPatient(args:any):Observable<any>{

    let url = this.baseUrl + "sendOtpToPatient";
    let headers = new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(JSON.stringify(args)),{headers:headers});
}

  checkOtp(args:any):Observable<any>{
    let url = this.baseUrl + "checkOtp";
    let headers = new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(JSON.stringify(args)));
  }
}