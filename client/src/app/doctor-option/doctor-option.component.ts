import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-doctor-option',
  templateUrl: './doctor-option.component.html',
  styleUrls: ['./doctor-option.component.css']
})
export class DoctorOptionComponent implements OnInit {

  isDiagnosisActive = true;
  isHistoryActive = false;

  constructor() { }

  ngOnInit() {
  }

  activateDiagnosis(){
    this.isDiagnosisActive = true;
    this.isHistoryActive = false;
    console.log("Status diag : "+this.isDiagnosisActive);
    console.log("Status hist : "+this.isHistoryActive);
  }

  activateHistory(){
    this.isHistoryActive = true;
    this.isDiagnosisActive = false;
    console.log("Status diag : "+this.isDiagnosisActive);
    console.log("Status hist : "+this.isHistoryActive);
  }

}
