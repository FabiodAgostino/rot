import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Macro, MacroFull } from 'src/app/models/Macro';
import { MacroService } from 'src/app/service/macro.service';
import { Utils } from 'src/app/utils/utility';
import { MacroInsertEditComponent } from '../macro-insert-edit/macro-insert-edit.component';

const ELEMENT_DATA: Macro[] = [
  {id:0,date: new Date(), author: 'Gennaro', macro:"addsadasasdasdasdasdasdas", like:5, tipologia:"Combattiva"},
  {id:1,date: new Date(), author: 'Zeno', macro:"Nuova macro figa", like:10, tipologia:"Generica"},
  {id:2,date: new Date('2020-10-06'), author: 'Veno', macro:"Nuova macro figa", like:0, tipologia:"Combattiva"},
  {id:3,date: new Date('2021-10-06'), author: 'Veno', macro:"Nonna macro figa", like:4, tipologia:"Farming risorse"},
  {id:4,date: new Date('2019-10-06'), author: 'Credo', macro:"Persa macro figa", like:2, tipologia:"Combattiva"},
  {id:5,date: new Date('2018-10-06'), author: 'Spezio', macro:"Vecchia macro figa", like:6, tipologia:"Farming risorse"},
  {id:6,date: new Date('2020-11-06'), author: 'Nero', macro:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
  {id:7,date: new Date('2020-11-06'), author: 'Nero', macro:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
  {id:8,date: new Date('2020-11-06'), author: 'Nero', macro:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
  {id:9,date: new Date('2020-11-06'), author: 'Nero', macro:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
  {id:10,date: new Date('2020-11-06'), author: 'Nero', macro:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
  {id:11,date: new Date('2020-11-06'), author: 'Nero', macro:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
  {id:12,date: new Date('2020-11-06'), author: 'Nero', macro:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
  {id:13,date: new Date('2020-11-06'), author: 'Nero', macro:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
  {id:14,date: new Date('2020-11-06'), author: 'Nero', macro:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
  {id:15,date: new Date('2020-11-06'), author: 'Nero', macro:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
  {id:16,date: new Date('2020-11-06'), author: 'Nero', macro:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
  {id:17,date: new Date('2020-11-06'), author: 'Nero', macro:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
  {id:18,date: new Date('2020-11-06'), author: 'Nero', macro:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
];


@Component({
  selector: 'app-macro-list',
  templateUrl: './macro-list.component.html',
  styleUrls: ['./macro-list.component.css']
})

export class MacroListComponent implements OnInit {

  macroFullForm = new FormGroup({
    author: new FormControl(''),
    macro: new FormControl(''),
    tipologia: new FormControl('')
  });

  filtroData: string ="";
  displayedColumns: string[] = ['autore', 'data','like','tipologia','macro'];
  dataSource = new MatTableDataSource<Macro>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  sortedData = new Array<Macro>();
  tipologieMacro = new Array<String>();

  constructor(public utils:Utils, public service: MacroService, public dialog: MatDialog){
    this.sortedData = this.dataSource.data.slice();
  }

  ngOnInit(): void {
    this.tipologieMacro=this.service.GetTipologieMacro();
    this.tipologieMacro.push('Tutte');
    this.macroFullForm.get('tipologia')?.setValue('Tutte');
  }



  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  applyFilter(x:any, y:string)
  {
    if(y!='tipologia')
    {
      let value = x.value.trim().toLowerCase();
      this.dataSource.filter=value;
    }
    else
    {
      if(x!='Tutte')
        this.dataSource.data = this.sortedData.filter(z=> z.tipologia.includes(x));
      else
        this.dataSource.data=this.sortedData;
    }
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'author':
          return this.compare(a.author, b.author, isAsc);
        case 'like':
          return this.compare(a.like, b.like, isAsc);
        case 'macro':
          return this.compare(a.macro, b.macro, isAsc);
        case 'tiplogia':
          return this.compare(a.tipologia, b.tipologia, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

getDisplayedColumns()
{
  return this.displayedColumns.filter(x=> x!='data');
}

detailMacro(id:number)
{
  const ref = this.dialogInsertEdit(id, false);
}


insertMacro()
{
  const ref = this.dialogInsertEdit(-1, true);
}

dialogInsertEdit(id:number = -1, insert=false)
{
  return this.dialog.open(MacroInsertEditComponent, {
    data: {id: id, insert:insert},
    width: this.utils.isSmartphone() ? '90vw' : '60vw',
    height: this.utils.isSmartphone() ? '90vh' : '60vh',
  });
}



}
