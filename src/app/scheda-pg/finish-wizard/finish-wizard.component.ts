import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Pg, SpellChierico, SpellPaladino } from 'src/app/models/Pg';
import  jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { SchedaPersonaggioService } from 'src/app/service/scheda-personaggio.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-finish-wizard',
  templateUrl: './finish-wizard.component.html',
  styleUrls: ['./finish-wizard.component.css']
})
export class FinishWizardComponent implements OnInit  {

  schedaPg = new Pg();
  guid = "";
  spellsPaladino = new SpellPaladino();
  spellsChierico = new SpellChierico();

  constructor(public dialogRef: MatDialogRef<FinishWizardComponent>, public service: SchedaPersonaggioService,@Inject(MAT_DIALOG_DATA)
  public data: any, private userService: UserService)
  {
    this.schedaPg=data.pg;
    this.guid = data.guid;

  }

  ngOnInit(): void {
    this.schedaPg.skills=this.schedaPg.skills.sort(x=> x.idTipologiaSkill);
    this.getInfoAggiuntive();
  }

  getInfoAggiuntive()
  {
    switch(this.schedaPg.classe.nome)
    {
      case "Paladino": this.service.getSpellPaladinoFromDivinita(this.schedaPg.religione.nome).subscribe(x=> this.spellsPaladino=x[0]); break;
      case "Chierico": this.service.getSpellChiericoFromDivinita(this.schedaPg.religione.nome).subscribe(x=> this.spellsChierico=x[0]); break;
    }
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

  isLoggedIn()
  {
    return this.userService.isLoggedIn;
  }


}
