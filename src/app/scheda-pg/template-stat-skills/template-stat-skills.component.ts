import { Component, Inject, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { map, Observable, of } from 'rxjs';
import { Classe, PartialPg, Pg } from 'src/app/models/Pg';
import { SchedaPersonaggioService } from 'src/app/service/scheda-personaggio.service';
import { Utils } from 'src/app/utils/utility';

@Component({
  selector: 'app-template-stat-skills',
  templateUrl: './template-stat-skills.component.html',
  styleUrls: ['./template-stat-skills.component.css']
})
export class TemplateStatSkillsComponent implements OnInit{

  pgToSave = new Pg();
  schedePg = new Array<Pg>();
  pgPaginati = new Array<Pg>();
  pageEvent = new PageEvent();
  pageSize: number = 5;
  isSmartphone: boolean = false;
  isOpened: boolean = true;
  selezionato: number=-1;
  classe = new Classe();;
  constructor(private service: SchedaPersonaggioService, public dialogRef: MatDialogRef<TemplateStatSkillsComponent>, @Inject(MAT_DIALOG_DATA)
  public data:  any, public utils: Utils) {
    if(data)
    {
      this.selezionato=data.Selezionato;
      this.classe=data.Classe;
    }

  }
  ngOnInit(): void {
    this.isSmartphone = this.utils.isSmartphone();
    if(this.classe.nome!=null)
      this.service.getSchedePgByClasse(this.classe.nome).subscribe(x=>
        {
          if(x[0]?.nome!==undefined)
          {
            this.elabSkills(x);
          }
        });
    }

    elabSkills(array: Array<PartialPg>)
    {
      this.schedePg = new Array<Pg>();
        array.forEach(z=>{
          if(z.guid!=null)
            this.service.getSkillsPg(z.guid).subscribe(y=>{
              if(z.utilizzatoNVolte>0)
                this.schedePg.push(PartialPg.Convert(z,y));
          })
        });

        this.getPaginate();
    }

    getPaginate()
    {
      setTimeout(() => {
        this.schedePg = [...new Map(this.schedePg.map(item =>
          [item['guid'], item])).values()];

        this.pgPaginati=this.schedePg.slice(0, this.pageSize);
        this.pgPaginati = this.pgPaginati.sort(x=> x.utilizzatoNVolte).reverse();

        this.pgPaginati.forEach(x=>{
          x.skills=x.skills.sort(function(a, b) { return a.idTipologiaSkill > b.idTipologiaSkill ? 1 : -1});
        })
      }, 500);
    }


    onPaginateChange(data: any) {
      this.pgPaginati = this.schedePg.slice(data.pageIndex*data.pageSize,
        data.pageIndex*data.pageSize + data.pageSize);
    }

    selectTemplate(pg: Pg = new Pg())
    {
      if(pg.nome)
        this.dialogRef.close({Pg:pg, Selezionato: this.selezionato});
      else
        this.dialogRef.close({Pg:this.pgToSave, Selezionato: this.selezionato});
    }

    select(pg: Pg, index: number)
    {
      this.selezionato=index;
      this.pgToSave=pg;
    }







}
