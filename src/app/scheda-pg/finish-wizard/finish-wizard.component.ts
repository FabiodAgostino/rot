import { ChangeDetectorRef, Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { InfoSkill, Pg, SpellChierico, SpellPaladino } from 'src/app/models/Pg';
import  jspdf, { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { SchedaPersonaggioService } from 'src/app/service/scheda-personaggio.service';
import { UserService } from 'src/app/service/user.service';
import { Subject } from 'rxjs';
import { Utils } from 'src/app/utils/utility';

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
  infoSkills = new Array<InfoSkill>();


  constructor(public dialogRef: MatDialogRef<FinishWizardComponent>, private cdr: ChangeDetectorRef,private renderer: Renderer2,public service: SchedaPersonaggioService,@Inject(MAT_DIALOG_DATA)
  public data: any, private userService: UserService, private _utils: Utils)
  {
    this.schedaPg=data.pg;
    this.guid = data.guid;
    this.infoSkills=data.infoSkills;

  }

  ngOnInit(): void {
    this.schedaPg.skills=this.schedaPg.skills.sort(x=> x.idTipologiaSkill);
    this.getInfoAggiuntive();
    this.userService.openSnackBar("infoAggiuntive","bottom","center");
  }

  getInfoAggiuntive()
  {
    switch(this.schedaPg.classe.nome)
    {
      case "Paladino": this.service.getSpellPaladinoFromDivinita(this.schedaPg.religione.nome).subscribe(x=> this.spellsPaladino=x[0]); break;
      case "Chierico": this.service.getSpellChiericoFromDivinita(this.schedaPg.religione.nome).subscribe(x=> this.spellsChierico=x[0]); break;
    }
  }

  exportAsPDF()
  {
    let data = document.getElementById("MyPdf");
    let data2 = (this.spellsChierico.spell.length>0 || this.spellsPaladino.spell.length>0) && this.isRotinrim() ? document.getElementById("MyPdf2") : null;
    let data3 = this.infoSkills.length>0 && this.isRotinrim() ? document.getElementById("MyPdf3") : null;
    if(data!=null)
    {
        html2canvas(data).then(canvas => {
        const contentDataURL = canvas.toDataURL('image/png')  // 'image/jpeg' for lower quality output.
        //let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
        let pdf = new jspdf('p', 'cm', 'a4');
        pdf.addImage(contentDataURL, 'PNG', 5.5, 1, 11,15.5);
        if(data2!=null && data3==null)
        {
          this.canvas(data2!,pdf).subscribe(x=> {pdf=x; this.pdfSave(pdf);})
        }
        else if(data3!=null && data2==null)
        {
          this.canvas(data3!,pdf).subscribe(x=> {pdf=x; this.pdfSave(pdf);})
        }
        else if(data3 && data2)
        {
            this.canvas(data2!, pdf).subscribe(y=>{
              pdf=y;
              this.canvas(data3!, pdf).subscribe(x=> {pdf=x; this.pdfSave(pdf);});
            });
        }
        else
          this.pdfSave(pdf);
      });
    }
  }


  canvas(element: HTMLElement, pdf: jsPDF)
  {
    let subject = new Subject<jspdf>();
    html2canvas(element).then(canvas => {
      pdf.addPage();
      const imgProps= pdf.getImageProperties(canvas);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      const contentDataURL = canvas.toDataURL('image/png')  // 'image/jpeg' for lower quality output.
      //let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
      pdf.addImage(contentDataURL, 'PNG', 0.1, 0.5, pdfWidth-1.1,pdfHeight);
      subject.next(pdf);
    });
    return subject.asObservable();
  }


  pdfSave(pdf: jsPDF)
  {
    pdf.save('RT '+this.schedaPg.nome+' schedaPersonaggio.pdf');
  }



  isLoggedIn()
  {
    return this.userService.isLoggedIn;
  }

  isSmartphone()
  {
    return this._utils.isSmartphone();
  }

  isRotinrim()
  {
    return this.userService.isRotinrim;
  }


}
