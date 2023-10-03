import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Macro, MacroFull } from 'src/app/models/Macro';
import { MacroService } from 'src/app/service/macro.service';
import { UserService } from 'src/app/service/user.service';
import { Utils } from 'src/app/utils/utility';
import { MacroInsertEditComponent } from '../macro-insert-edit/macro-insert-edit.component';
import { MacroMultiInsertComponent } from '../macro-multi-insert/macro-multi-insert.component';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


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
  isLoggedIn:boolean=false;

  constructor(public utils:Utils, public service: MacroService, public dialog: MatDialog, private userService:UserService, private activated:ActivatedRoute){
  }

  ngOnInit(): void {
    this.getMacros();
    this.userService.isLoggedInObs.subscribe(x=>{
      this.isLoggedIn=x;
      this.checkUser();
      this.getLink();
    })
      this.tipologieMacro=this.service.GetTipologieMacro().slice();
      this.tipologieMacro.push('Tutte');
      this.macroFullForm.get('tipologia')?.setValue('Tutte');
  }

  getLink()
  {
    const guid=this.activated.snapshot.queryParamMap.get('link');
    if(guid)
      this.detailMacro(guid);
  }


  getMacros()
  {
        this.service.getMacros().subscribe(x=>{
          this.dataSource = new MatTableDataSource<Macro>(x);
          this.sortedData = this.dataSource.data.slice();
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
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
        case 'title':
          return this.compare(a.title, b.title, isAsc);
        case 'tiplogia':
          return this.compare(a.tipologia, b.tipologia, isAsc);
        default:
          return 0;
      }
    });
    this.dataSource.data=this.sortedData;
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

getDisplayedColumns()
{
  return this.displayedColumns = ['autore','tipologia','title','like'];
}

detailMacro(id:any)
{
  const ref = this.dialogInsertEdit(id, false);
}


insertMacro()
{
  if(!this.user)
  {
    this.userService.openSnackBar("registrazioneFallita","bottom","center","Effettua prima la login");
    return;
  }


  const ref = this.dialogInsertEdit(-1, true);
  ref.afterClosed().subscribe(x=>{
    this.getMacros();
  })
}

dialogInsertEdit(id:any = -1, insert=false)
{
    return this.dialog.open(MacroInsertEditComponent, {
      data: {id: id, insert:insert},
      width: this.utils.isSmartphone() ? '100vw' : '50vw',
      height: this.utils.isSmartphone() ? '90vh' : '70vh',
    });
}


checkUser()
  {
    const user= this.userService.userLoggato;
    if(user)
      this.user = user.username!;

  }

checkThumb(row: any)
{
  return this.isLoggedIn && this.user!='' && this.user!=row.author && !row.utenti.includes(this.user);
}

checkIfVote(row: any)
{
  return row.utenti.includes(this.user) && this.isLoggedIn;
}

likeIt(guid: string)
{
  this.service.addLikeMacro(guid,this.user);
}

fileInput()
{
  if(this.user=='' || this.user==null)
    {
      this.userService.openSnackBar("registrazioneFallita","bottom","center","Effettua prima la login");
      return;
    }
    document.getElementById("fileInput")?.click();
}

async openMultiInsert(event: any)
{
    var file= event.target.files[0];
    if(file.name!="macros.xml")
    {
      var dir= "The Miracle/Data/Profiles/nomeAccount/The Miracle 3/nomePg/macros.xml";
      alert("Inserisci il file macros.xml! ("+dir+")");
      return;
    }

    const ref=this.utils.getAllMacrosByXml(await file.text()).subscribe(array=>{
      if(array.length>0)
      {
      this.dialog.open(MacroMultiInsertComponent, {
        data:{macros: array},
        width: this.utils.isSmartphone() ? '100vw' : '45vw',
        height: this.utils.isSmartphone() ? '90vh' : '74vh',
      });
      ref.unsubscribe();
      }
      else
        alert("Nessuna macro presente nel file macros.xml!");
      });
      event.target.value = null;

}





}
