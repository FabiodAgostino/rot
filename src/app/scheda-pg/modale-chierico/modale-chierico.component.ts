import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModaleSkillsComponent } from '../modale-skills/modale-skills.component';
import { SpellChierico, SpellPaladino } from '../../models/Pg';
import { SchedaPersonaggioService } from '../../service/scheda-personaggio.service';

@Component({
  selector: 'app-modale-chierico',
  templateUrl: './modale-chierico.component.html',
  styleUrls: ['./modale-chierico.component.css']
})
export class ModaleChiericoComponent implements OnInit {

  spellChierico = new SpellChierico();
  religione = "";
  constructor(public dialogRef: MatDialogRef<ModaleChiericoComponent>, @Inject(MAT_DIALOG_DATA)
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
    this.spellChierico.religione="";

    if(this.religione!=undefined && this.religione!='')
      this.service.getSpellChiericoFromDivinita(this.religione).subscribe(x=> {
        if(x.length>0)
            this.spellChierico=x[0];
      });
  }

}
