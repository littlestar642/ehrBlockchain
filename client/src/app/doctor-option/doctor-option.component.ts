import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-doctor-option',
  templateUrl: './doctor-option.component.html',
  styleUrls: ['./doctor-option.component.css']
})
export class DoctorOptionComponent implements OnInit {

  isDiagnosisActive = true;
  isHistoryActive = false;
  private patientId : string;
  private doctorId : string;
  constructor( private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.patientId = localStorage.getItem("patientId");
    this.doctorId = localStorage.getItem("doctorId");
  }

  activateDiagnosis(){
    this.spinner.show();
 
     setTimeout(() => {
     //spinner ends after 2 seconds 
       this.spinner.hide();
    }, 2000);
    this.isDiagnosisActive = true;
    this.isHistoryActive = false;
    console.log("Status diag : "+this.isDiagnosisActive);
    console.log("Status hist : "+this.isHistoryActive);
  }

  activateHistory(){
    this.spinner.show();
 
     setTimeout(() => {
     //spinner ends after 2 seconds 
       this.spinner.hide();
    }, 2000);
    this.isHistoryActive = true;
    this.isDiagnosisActive = false;
    console.log("Status diag : "+this.isDiagnosisActive);
    console.log("Status hist : "+this.isHistoryActive);
  }

}
