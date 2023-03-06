import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Macro, MacroFull } from 'src/app/models/Macro';
import { MacroService } from 'src/app/service/macro.service';
import { UserService } from 'src/app/service/user.service';
import { Utils } from 'src/app/utils/utility';
import { MacroInsertEditComponent } from '../macro-insert-edit/macro-insert-edit.component';

// const ELEMENT_DATA: Macro[] = [
//   {guid:'0',date: new Date(), author: 'Gennaro', title:"addsadasasdasdasdasdasdas", like:5, tipologia:"Combattiva"},
//   {guid:'1',date: new Date(), author: 'Zeno', title:"Nuova macro figa", like:10, tipologia:"Generica"},
//   {guid:'2',date: new Date('2020-10-06'), author: 'Veno', title:"Nuova macro figa", like:0, tipologia:"Combattiva"},
//   {guid:'3',date: new Date('2021-10-06'), author: 'Veno', title:"Nonna macro figa", like:4, tipologia:"Farming risorse"},
//   {guid:'4',date: new Date('2019-10-06'), author: 'Credo', title:"Persa macro figa", like:2, tipologia:"Combattiva"},
//   {guid:'5',date: new Date('2018-10-06'), author: 'Spezio', title:"Vecchia macro figa", like:6, tipologia:"Farming risorse"},
//   {guid:'6',date: new Date('2020-11-06'), author: 'Nero', title:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
//   {guid:'7',date: new Date('2020-11-06'), author: 'Nero', title:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
//   {guid:'8',date: new Date('2020-11-06'), author: 'Nero', title:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
//   {guid:'9',date: new Date('2020-11-06'), author: 'Nero', title:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
//   {guid:'10',date: new Date('2020-11-06'), author: 'Nero', title:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
//   {guid:'11',date: new Date('2020-11-06'), author: 'Nero', title:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
//   {guid:'12',date: new Date('2020-11-06'), author: 'Nero', title:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
//   {guid:'13',date: new Date('2020-11-06'), author: 'Nero', title:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
//   {guid:'14',date: new Date('2020-11-06'), author: 'Nero', title:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
//   {guid:'15',date: new Date('2020-11-06'), author: 'Nero', title:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
//   {guid:'16',date: new Date('2020-11-06'), author: 'Nero', title:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
//   {guid:'17',date: new Date('2020-11-06'), author: 'Nero', title:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
//   {guid:'18',date: new Date('2020-11-06'), author: 'Nero', title:"Nuova macro brutta", like:2, tipologia:"Alza skill"},
// ];


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

  user: string ="";
  filtroData: string ="";
  displayedColumns: string[] = ['autore', 'data','like','tipologia','title','likeIt'];
  dataSource = new MatTableDataSource<Macro>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  sortedData = new Array<Macro>();
  tipologieMacro = new Array<String>();

  constructor(public utils:Utils, public service: MacroService, public dialog: MatDialog, private userService:UserService){
    this.sortedData = this.dataSource.data.slice();
  }

  ngOnInit(): void {
    this.tipologieMacro=this.service.GetTipologieMacro();
    this.getMacros();
    this.tipologieMacro.push('Tutte');
    this.macroFullForm.get('tipologia')?.setValue('Tutte');
    this.checkUser();
  }

getMacros()
{
  this.service.getMacros().subscribe(x=>this.dataSource = new MatTableDataSource<Macro>(x));
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
          return this.compare(a.title, b.title, isAsc);
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
  return this.displayedColumns = ['autore','tipologia','title','like'];
}

detailMacro(id:number)
{
  const ref = this.dialogInsertEdit(id, false);
}


insertMacro()
{
  const ref = this.dialogInsertEdit(-1, true);
  ref.afterClosed().subscribe(x=>{
    this.getMacros();
  })
}

dialogInsertEdit(id:number = -1, insert=false)
{
  return this.dialog.open(MacroInsertEditComponent, {
    data: {id: id, insert:insert},
    width: this.utils.isSmartphone() ? '100vw' : '50vw',
    height: this.utils.isSmartphone() ? '90vh' : '70vh',
  });
}


checkUser()
  {
    const md5=localStorage.getItem("user")?.toString();
    if(md5)
    {
      const rif=this.userService.checkUserMd5(md5).subscribe(user=> {
        if(user.length>0)
        {
          this.user = user[0].nomePg;
          rif?.unsubscribe();
        }
      });
    }

  }

checkThumb(row: any)
{
  return this.user!='' && this.user!=row.author;
}





}
