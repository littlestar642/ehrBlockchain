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


  setPatientPassword(args:any): Observable<any> {
    let url = this.baseUrl + "setPatientPassword";
    let headers=new HttpHeaders();
    let newObj={"patientId":"","password":""}
    newObj.patientId=args.patientId;
    newObj.password=args.password
    headers.set('Content-Type','application/json');
    return this.http.post<any>(url,JSON.parse(JSON.stringify(newObj)),{headers:headers});
  }


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
    let newObj={"patientId":"","firstName":"","lastName":"","doctorId":"","emailId":""};
    newObj.patientId=args.patientId;
    newObj.firstName=args.patientFirstName;
    newObj.lastName=args.patientLastName;
    newObj.doctorId=args.doctorId;
    newObj.emailId=args.emailId;
    console.log(newObj);
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

    checkPatientPassword(args:string):Observable<any>{
    let url = this.baseUrl + "checkPatientPassword";
    let headers = new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(args),{headers:headers});
    }

  generateOtp(patientId:string):Observable<any>{
    let url = this.baseUrl + "generateOtp";
    let headers = new HttpHeaders();
    headers.set('Content-Type','application/json');
    let args={"patientId":patientId};
    console.log(args);
    return this.http.post(url,JSON.parse(JSON.stringify(args)),{headers:headers});
  }

  checkOtp(args:any):Observable<any>{
    let url = this.baseUrl + "checkOtp";
    let headers = new HttpHeaders();
    headers.set('Content-Type','application/json');
    console.log(args);
    return this.http.post(url,JSON.parse(args));
  }


  patientHasPassword(args:any):Observable<any>{
    let url = this.baseUrl + "patientHasPassword";
    let headers = new HttpHeaders();
    headers.set('Content-Type','application/json');
    let newObj={"patientId":args.patientId}
    return this.http.post(url,JSON.parse(JSON.stringify(args)),{headers:headers});
  }
}