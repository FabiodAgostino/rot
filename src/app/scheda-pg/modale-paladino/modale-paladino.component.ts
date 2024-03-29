import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription, take } from 'rxjs';
import { SpellPaladino } from '../../models/Pg';
import { SchedaPersonaggioService } from '../../service/scheda-personaggio.service';

@Component({
  selector: 'app-modale-paladino',
  templateUrl: './modale-paladino.component.html',
  styleUrls: ['./modale-paladino.component.css']
})
export class ModalePaladinoComponent implements OnInit {

  spellsPaladino = new SpellPaladino();
  religione = "";
  constructor(public dialogRef: MatDialogRef<ModalePaladinoComponent>, @Inject(MAT_DIALOG_DATA)
  public data: string, private service: SchedaPersonaggioService)
  {
    if(data!=undefined && data!=='')
      this.religione=data;

  }
  ngOnInit(): void {
    this.getSpells();
  }


  getSpells()
  {
      if(this.religione!=undefined && this.religione!='')
      {
      this.service.getSpellPaladinoFromDivinita(this.religione).subscribe(x=>
        {
          if(x.length>0)
            this.spellsPaladino=x[0];
        });
     }
  }

}
