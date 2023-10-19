import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FullStatistica } from 'src/app/models/Statistiche';

@Component({
  selector: 'app-modale-statistiche',
  templateUrl: './modale-statistiche.component.html',
  styleUrls: ['./modale-statistiche.component.css']
})
export class ModaleStatisticheComponent implements OnInit{

  @Input() stat?: FullStatistica;
  mediaFama:string="0";
  mediaTempo:string="0";
  mediaMonete:string="0";
  mediaSangue:string="0";
  mediaFrammenti:string="0";
  mediaNulei?:string;
  mediaPg?:string;
  listaClassi?:Array<string>;

  constructor() {
  }

  setMedia()
  {
    this.mediaFama= (((this.stat!.statistica!.fama!-this.stat!.media!.fama) / this.stat!.media!.fama) * 100).toFixed(2);
    this.mediaMonete= (((this.stat!.statistica!.monete!-this.stat!.media!.monete) / this.stat!.media!.monete) * 100).toFixed(2);
    this.mediaSangue= (((this.stat!.statistica!.sangue!-this.stat!.media!.sangue) / this.stat!.media!.sangue) * 100).toFixed(2);
    this.mediaFrammenti= (((this.stat!.statistica!.frammenti!-this.stat!.media!.frammenti) / this.stat!.media!.frammenti) * 100).toFixed(2);
    this.mediaNulei= (((this.stat!.statistica!.nuclei!-this.stat!.media!.nuclei) / this.stat!.media!.nuclei) * 100).toFixed(2);
    const sommaTotaleSecondi = this.stat!?.statistica?.tempo?.hours! * 3600 + this.stat!.statistica?.tempo?.minutes! * 60 + this.stat!.statistica?.tempo?.seconds!;
    const sommaMediaSecondi = this.stat!?.media?.tempo?.hours! * 3600 + this.stat!.media?.tempo?.minutes! * 60 + this.stat!.media?.tempo?.seconds!;
    this.mediaTempo = (((sommaTotaleSecondi -sommaMediaSecondi) / sommaMediaSecondi) * 100).toFixed(2);
    this.mediaPg= (((this.stat!.statistica!.userList?.length!-this.stat!.media!.numeroPg!) / this.stat!.media!.numeroPg!) * 100).toFixed(2);
    if(this.mediaTempo==="0.00" || this.mediaTempo==="100")
      this.mediaTempo="";

    this.listaClassi = this.stat?.statistica?.userRole;

  }
  ngOnInit(): void {
    this.setMedia();
  }

}
