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

  schedePg = new Array<Pg>();
  pgPaginati = new Array<Pg>();
  pageEvent = new PageEvent();
  pageSize: number = 5;
  isSmartphone: boolean = false;

  constructor(private service: SchedaPersonaggioService, public dialogRef: MatDialogRef<TemplateStatSkillsComponent>, @Inject(MAT_DIALOG_DATA)
  public classe:  Classe, public utils: Utils) {

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
        setTimeout(() => {
          this.schedePg = [...new Map(this.schedePg.map(item =>
            [item['guid'], item])).values()];

          this.pgPaginati=this.schedePg.slice(0, this.pageSize);
          this.pgPaginati = this.pgPaginati.sort(x=> x.utilizzatoNVolte)
          this.pgPaginati = this.pgPaginati.reverse();
          console.log(this.pgPaginati)
        }, 500);
    }


    onPaginateChange(data: any) {
      this.pgPaginati = this.schedePg.slice(data.pageIndex*data.pageSize,
        data.pageIndex*data.pageSize + data.pageSize);
    }

    selectTemplate(pg: Pg)
    {
      console.log(pg)
      this.dialogRef.close(pg);
    }




}
