import { Ehr } from './../classes/ehr';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, Subscription, Subscribable } from 'rxjs';
import { tap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  
  private baseUrl = "http://localhost:8000/";

  constructor(  private http : HttpClient) { }

  createEhr(ehr : Ehr) : Observable<any>{
    let url = this.baseUrl + "createEhr";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    console.log(ehr);
    return this.http.post(url,JSON.parse(JSON.stringify(ehr)),{headers});
  }

  createDoctor(args:any):Observable<any>{
    let newObj={"doctorId":"","firstName":"","lastName":"","password":""};
    newObj.doctorId=args.doctorId;
    newObj.firstName=args.doctorFirstName;
    newObj.lastName=args.doctorLastName;
    newObj.password=args.doctorPassword;
    let url = this.baseUrl + "createDoctor";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(JSON.stringify(newObj)),{headers:headers});
  }

  

  checkDoctor(doctor:any) : Subscribable<any>{
    let url = this.baseUrl + "checkDoctor";
    let headers=new HttpHeaders();
    let newObj={"doctorId":"","password":""}
    newObj.doctorId=doctor.doctorId;
    newObj.password=doctor.doctorPassword;
    headers.set('Content-Type','application/json');
    return this.http.post<any>(url,JSON.parse(JSON.stringify(newObj)),{headers:headers});
  }

  // addPatient( user : User) : Observable<User>{
  //   let url = this.baseUrl + "addPatient";
  //   return this.http.post<User>(url,user).pipe(
  //     tap(
  //       resp => {
  //         console.log("doc service -> addPatient : "+JSON.stringify(resp));
  //       }
  //     )
  //   );
  // }

  getHistory( args:any) : Observable<any>  {
    let url = this.baseUrl + "getHistoryForPatient";
    let headers=new HttpHeaders();
    headers.set('Content-Type','application/json');
    return this.http.post(url,JSON.parse(JSON.stringify(args)),{headers});
  }
}