import { AlertService } from './../services/alert.service';
import { DoctorService } from './../services/doctor.service';
import { User } from './../classes/user';
import { Utils } from './../classes/utils';
import { Symptoms } from './../classes/symptoms';
import { Ehr } from './../classes/ehr';
import { BloodTest } from './../classes/blood-test';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.css']
})
export class DiagnosisComponent implements OnInit {

  private patientId : string;
  private doctorId : string;
  title = 'forms';
  paymentMethods=['Cash','Cheque'];
  paymentDones=['Yes','No'];
  userModel=new User('random','rob@test.com',9456454455,511241);
  bloodTest=new BloodTest(30,30,30,30,30,30);
  symptoms=new Symptoms(true,65,true,true,80);
  utils=new Utils("2020-12-30",3000,true,"default");
  ehr =new Ehr("D001","P001","E001",this.symptoms,"Other Problems",this.bloodTest,"List of Medicines",this.utils,"Review of doctor");
  TrueValue=true;
  FalseValue=false;
  paymentMethodHasError=true;
  validatepaymentMethod(value)
  {
    if(value=== 'default')
    {
      this.paymentMethodHasError=true;
    }
    else{
      this.paymentMethodHasError=false;
    }
  }
  constructor(  private doctorService : DoctorService,
                private alertService : AlertService ) { }

  ngOnInit() {
    this.patientId = localStorage.getItem("patientId");
    this.doctorId = localStorage.getItem("doctorId");
  }

  recordData(){
    console.log("blood test : "+JSON.stringify(this.bloodTest));
    console.log("symptoms : "+JSON.stringify(this.symptoms));
    console.log("utils : "+JSON.stringify(this.utils));
    console.log("Ehr : "+JSON.stringify(this.ehr));
    //call service
    // this.ehr.patientID = localStorage.getItem("pateintId");
    // doctorId is fixed constant as of now
    this.doctorService.createEhr(this.ehr).subscribe( 
      data=>{
        console.log("resp : "+JSON.stringify(data));
        this.alertService.success("Diagnosis recorded successfully !!!");
      },
      error => {
        console.log("error : "+JSON.stringify(error));
        this.alertService.error("Failed to record Diagnosis :(");
      });
  }

}
