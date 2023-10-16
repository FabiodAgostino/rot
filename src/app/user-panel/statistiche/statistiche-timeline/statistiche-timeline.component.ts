import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Statistiche } from 'src/app/models/Statistiche';

@Component({
  selector: 'app-statistiche-timeline',
  templateUrl: './statistiche-timeline.component.html',
  styleUrls: ['./statistiche-timeline.component.css']
})
export class StatisticheTimelineComponent implements OnInit{
  @Output() openModal = new EventEmitter<Statistiche>();

  ngOnInit(): void {
  }

  @Input() items?: Array<Statistiche>;

  getWidth()
  {
    if(this.items!=undefined)
      return (this.items.length*10).toString();
    else
      return "10";
  }
  
  sendEvent(item:Statistiche)
  {
    this.openModal.emit(item);
  }
}
