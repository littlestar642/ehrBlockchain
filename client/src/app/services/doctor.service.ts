import { User } from './../classes/user';
import { Ehr } from './../classes/ehr';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ObserveOnMessage } from 'rxjs/internal/operators/observeOn';


@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  
  private baseUrl = "http://localhost:8000/";

  constructor(  private http : HttpClient ) { }

  createEhr(ehr : Ehr) : Observable<Ehr>{
    let url = this.baseUrl + "createEhr";
    return this.http.post<Ehr>(url,ehr).pipe(
      tap(
        resp => {
          console.log("doc dervice -> saveDiagnosis resp : "+JSON.stringify(resp));
        }
      )
    );
    // return this.http.post<Ehr>(url,ehr,{observe:'response'}).pipe(
    //   tap( resp =>{
    //     console.log(JSON.stringify(resp));
    //   })
    // );
  }

  createDoctor(args:any):Observable<any>{
    let newObj={doctorID:"",firstName:"",lastName:""};
    newObj.doctorID=args.doctorId;
    newObj.firstName=args.doctorFirstName;
    newObj.lastName=args.doctorLastName;
    let url = this.baseUrl + "createDoctor";
    return this.http.post(url,newObj).pipe(
      tap(resp=>{
        console.log(resp);
      })
    )
  }

  

  // verifyPatient( parientId : string, otp : string) : Observable<any>{
  //   let url = this.baseUrl + "verifyPatient";
  //   let headers = new HttpHeaders();
  //   headers.set("patientId",parientId);
  //   headers.set("otp",otp);
  //   return this.http.get<any>(url,{headers:headers});
  // }

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

  getHistory(patientId:string) : Observable<any>  {
    let url = this.baseUrl + "getHistory/"+patientId;
    return this.http.get(this.baseUrl).pipe(
      tap(
        resp => {
          console.log("doc service -> getHistory : "+JSON.stringify(resp));
        }
      )
    );
  }
}