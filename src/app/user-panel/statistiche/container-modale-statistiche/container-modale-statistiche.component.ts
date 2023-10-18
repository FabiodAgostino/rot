import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FullStatistica } from 'src/app/models/Statistiche';

@Component({
  selector: 'app-container-modale-statistiche',
  templateUrl: './container-modale-statistiche.component.html',
  styleUrls: ['./container-modale-statistiche.component.css']
})
export class ContainerModaleStatisticheComponent {

  arrayStatistiche?:Array<FullStatistica>;
  index:number=0;
  constructor(@Inject(MAT_DIALOG_DATA) public data:  Array<FullStatistica>) {
    if(data!=null)
    {
      this.arrayStatistiche=data;
    }
  }

  setIndex(text:string)
  {
    if(text=="left")
      if(this.index>0)
        this.index--;
    if(text=="right")
      if((this.index+1)< this.arrayStatistiche?.length!)
        this.index++;
  }

  getArray()
  {
    if(this.arrayStatistiche)
      return this.arrayStatistiche[this.index];
    return undefined;
  }

}
