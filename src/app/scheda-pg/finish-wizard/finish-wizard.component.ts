import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Pg } from 'src/app/models/Pg';
import  jspdf from 'jspdf';
import html2canvas from 'html2canvas';

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

  exportAsPDF(div: string)
  {
    console.log(div);
    let data = document.getElementById(div);
    if(data!=null)
    {
        html2canvas(data).then(canvas => {
        const contentDataURL = canvas.toDataURL('image/png')  // 'image/jpeg' for lower quality output.
        //let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
        let pdf = new jspdf('p', 'cm', 'c6');
        pdf.addImage(contentDataURL, 'PNG', 0.1, 0.4, 11,15.5);
        pdf.save('RT '+this.schedaPg.nome+' schedaPersonaggio.pdf');
      });
    }
  }


}
