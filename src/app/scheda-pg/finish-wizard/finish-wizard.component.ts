import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Pg } from 'src/app/models/Pg';

@Component({
  selector: 'app-finish-wizard',
  templateUrl: './finish-wizard.component.html',
  styleUrls: ['./finish-wizard.component.css']
})
export class FinishWizardComponent implements OnInit  {

  schedaPg = new Pg();
  guid = "";
  constructor(public dialogRef: MatDialogRef<FinishWizardComponent>, @Inject(MAT_DIALOG_DATA)
  public data: any)
  {
    this.schedaPg=data.pg;
    this.guid = data.guid;

  }

  ngOnInit(): void {
    this.schedaPg.skills=this.schedaPg.skills.sort(x=> x.idTipologiaSkill);
  }


}
