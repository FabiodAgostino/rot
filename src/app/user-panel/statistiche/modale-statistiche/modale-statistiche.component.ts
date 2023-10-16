import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FullStatistica } from 'src/app/models/Statistiche';

@Component({
  selector: 'app-modale-statistiche',
  templateUrl: './modale-statistiche.component.html',
  styleUrls: ['./modale-statistiche.component.css']
})
export class ModaleStatisticheComponent implements OnInit{

  fullStatistica?: FullStatistica;
  mediaFama:string="0";
  mediaTempo:string="0";
  mediaMonete:string="0";
  mediaSangue:string="0";
  mediaFrammenti:string="0";
  mediaNulei?:string;

  constructor(@Inject(MAT_DIALOG_DATA) public data:  FullStatistica, dialog: MatDialog) {
    if(data)
    {
      console.log("quiiiiiii",data)
      this.fullStatistica=data;
      this.setMedia();
    }
  }

  setMedia()
  {
    console.log(this.data.media?.monete)
    this.mediaFama= (((this.data.statistica!.fama!-this.data.media!.fama) / this.data.media!.fama) * 100).toFixed(2);
    this.mediaMonete= (((this.data.statistica!.monete!-this.data.media!.monete) / this.data.media!.monete) * 100).toFixed(2);
    this.mediaSangue= (((this.data.statistica!.sangue!-this.data.media!.sangue) / this.data.media!.sangue) * 100).toFixed(2);
    this.mediaFrammenti= (((this.data.statistica!.frammenti!-this.data.media!.frammenti) / this.data.media!.frammenti) * 100).toFixed(2);
    this.mediaNulei= (((this.data.statistica!.nuclei!-this.data.media!.nuclei) / this.data.media!.nuclei) * 100).toFixed(2);

    const sommaTotaleSecondi = this.fullStatistica?.statistica?.tempo?.hours! * 3600 + this.fullStatistica?.statistica?.tempo?.minutes! * 60 + this.fullStatistica?.statistica?.tempo?.seconds!;
    const sommaMediaSecondi = this.fullStatistica?.media?.tempo?.hours! * 3600 + this.fullStatistica?.media?.tempo?.minutes! * 60 + this.fullStatistica?.media?.tempo?.seconds!;
    this.mediaTempo = (((sommaTotaleSecondi -sommaMediaSecondi) / sommaMediaSecondi) * 100).toFixed(2);
    console.log(this.mediaTempo)
    if(this.mediaTempo==="0.00" || this.mediaTempo==="100")
      this.mediaTempo="";

  }
  ngOnInit(): void {
  }

}
