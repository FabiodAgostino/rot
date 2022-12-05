import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModaleSkillsComponent } from '../modale-skills/modale-skills.component';
import { SpellPaladino } from '../../models/Pg';
import { SchedaPersonaggioService } from '../../service/scheda-personaggio.service';

@Component({
  selector: 'app-modale-chierico',
  templateUrl: './modale-chierico.component.html',
  styleUrls: ['./modale-chierico.component.css']
})
export class ModaleChiericoComponent implements OnInit {

  spellsPaladino = new Array<SpellPaladino>();
  religione = "";
  constructor(public dialogRef: MatDialogRef<ModaleSkillsComponent>, @Inject(MAT_DIALOG_DATA)
  public data: SpellPaladino, private service: SchedaPersonaggioService)
  {
    this.religione=data.religione;
  }
  ngOnInit(): void {
    this.service.getSpellPaladinoFromDivinita(this.religione).subscribe(x=> this.spellsPaladino=x);
  }

}
