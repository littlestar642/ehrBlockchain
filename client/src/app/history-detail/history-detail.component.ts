import { Ehr } from './../classes/ehr';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router"
import { Location } from "@angular/common"

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.css']
})
export class HistoryDetailComponent implements OnInit {

  private recordNumber  : number;
  private flag : boolean = false;
  // @Input()
  private records : Ehr[];

  private record : Ehr;
  constructor(  private location : Location,
                private route : ActivatedRoute  ) { 
 
  }

  ngOnInit() {
    this.recordNumber = Number(this.route.snapshot.paramMap.get('recordNumber'));
    this.record = JSON.parse(localStorage.getItem("records"))[this.recordNumber];
    console.log("Records [0] : "+JSON.stringify(this.record));
    
  }

  goBack() : void
  {
    this.location.back();
  }

}
