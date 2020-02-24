import { AlertService } from './../services/alert.service';
import { DoctorService } from './../services/doctor.service';
import { Ehr } from './../classes/ehr';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  private patientId : string;
  private doctorId : string;
  private records : Ehr[];
  constructor(  private doctorService : DoctorService,
                private alertService : AlertService ) { 
    this.records = new Array(3);
    this.records[0] = new Ehr("","P001","",null,"",null,"",null,"");
    this.records[1] = new Ehr("","P002","",null,"",null,"",null,"");
    this.records[2] = new Ehr("","P003","",null,"",null,"",null,"");
    localStorage.setItem("records",JSON.stringify(this.records));
  }

  ngOnInit() {
    this.patientId = localStorage.getItem("patientId");
    this.doctorId = localStorage.getItem("doctorId");
    
    //this.getHistory();
    console.log("Help : "+JSON.stringify(this.records[0])); 
  }

  getHistory(){
    this.doctorService.getHistory(this.patientId).subscribe(
      res => {
        console.log("getHistory res : "+JSON.stringify(res));
        this.records = res;
      },
      error => {
        console.log("getHistory error : "+JSON.stringify(error));
        this.alertService.info("No record found.");
      }
    )
  }

}
