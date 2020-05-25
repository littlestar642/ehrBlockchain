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
  private records : Ehr[];

  @Input()
  private record : Ehr;
  constructor(  private location : Location,
                private route : ActivatedRoute  ) { 
 
  }

  ngOnInit() {
    console.log("Records [0] : "+JSON.stringify(this.record));
  }

  goBack() : void
  {
    this.location.back();
  }

}
