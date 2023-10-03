import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InfoSkill } from 'src/app/models/Pg';

@Component({
  selector: 'app-info-skills',
  templateUrl: './info-skills.component.html',
  styleUrls: ['./info-skills.component.css']
})
export class InfoSkillsComponent implements OnInit {

  infoSkills = new Array<InfoSkill>();
  constructor(public dialogRef: MatDialogRef<InfoSkillsComponent>, @Inject(MAT_DIALOG_DATA)
  public data:  Array<InfoSkill>)
  {
    this.infoSkills=data;
  }
  ngOnInit(): void {
  }

}
