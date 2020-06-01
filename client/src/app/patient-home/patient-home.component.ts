import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from './../services/patient.service';
import { Patient } from '../classes/patient';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../services/alert.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Ehr } from '../classes/ehr';

@Component({
  selector: 'app-patient-home',
  templateUrl: './patient-home.component.html',
  styleUrls: ['./patient-home.component.css']
})
export class PatientHomeComponent implements OnInit {

  noPassword:boolean=true;
  patientId: string;
  records:Ehr[];
  show: boolean[];
  isHistoryActive : boolean = true;
  isMyDoctorsActive : boolean = false;

  constructor(  private patientService : PatientService,
                private router : Router, 
                private alertService:AlertService,
                private spinner: NgxSpinnerService) { }

  form = new FormGroup({
    password : new FormControl('',Validators.required),
  });


  ngOnInit() {
    this.patientId = localStorage.getItem("patientId");
    this.hasPassword();
    this.getHistoryForPatient();
    this.records = [];
    this.show = [];
  }

  hasPassword(){
    let patientId=this.patientId;
    this.patientService.patientHasPassword({patientId}).subscribe((data)=>{
      if(!data.action){
        this.alertService.error(data.message);
      }
      else{
        this.noPassword=false;
      }

    });
  }

  getHistoryForPatient(){
    let args={"patientId":this.patientId};
    this.patientService.getHistory(args).subscribe(
      res=>{
        if(!res.action){
          this.alertService.error(res.message);
        }
        else{
          let arr= JSON.parse(res.message);
          arr.forEach(r=>{
            this.records.push(r);
            this.show.push(false);
          });
          console.log("records : ",this.records);
        } 
      }
    );
  }

  setPassword(){
    let patientId=this.patientId;
    let password=this.form.get('password').value;
    this.patientService.setPatientPassword({patientId,password}).subscribe((data)=>{
      if(!data.action){
        this.alertService.error(data.message);
      }
      else{
        this.alertService.success("password set successfully");
        this.noPassword=false;
      }
    });
  }

  activateHistory(){
    this.isHistoryActive = true;
    this.isMyDoctorsActive = false;
  }

  activateMyDoctors(){
    this.isHistoryActive = false;
    this.isMyDoctorsActive = true;
  }

  showRecord(recordNumber){
    this.show[recordNumber]=true;
  }

  hideRecord(recordNumber){
    this.show[recordNumber]=false;
  }

  logout(){
    this.patientService.logout();
  }

}
