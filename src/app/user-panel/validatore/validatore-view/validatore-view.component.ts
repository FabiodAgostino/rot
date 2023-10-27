import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MacroInsertEditComponent } from 'src/app/macro/macro-insert-edit/macro-insert-edit.component';
import { MacroMultiInsertComponent } from 'src/app/macro/macro-multi-insert/macro-multi-insert.component';
import { Macro } from 'src/app/models/Macro';
import { Dungeon, FullStatistica, MedieStatistiche, StatisticheImmagini } from 'src/app/models/Statistiche';
import { ServerDiscord } from 'src/app/models/discord';
import { MacroService } from 'src/app/service/macro.service';
import { StatisticheService } from 'src/app/service/statistiche.service';
import { UserService } from 'src/app/service/user.service';
import { ModaleSiNoComponent } from 'src/app/utils/modale-si-no/modale-si-no.component';
import { Utils } from 'src/app/utils/utility';
import { ContainerStatisticheValidatoreComponent } from '../container-statistiche-validatore/container-statistiche-validatore.component';

@Component({
  selector: 'app-validatore-view',
  templateUrl: './validatore-view.component.html',
  styleUrls: ['./validatore-view.component.css']
})
export class ValidatoreViewComponent {

  macroFullForm = new FormGroup({
    author: new FormControl(''),
    macro: new FormControl(''),
    tipologia: new FormControl('')
  });

  user: string ="";
  filtroData: string ="";
  displayedColumns: string[] = ['server', 'date','dungeon','infoAggiuntive','inAttesaDiValidazione','valida'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  tipologieMacro = new Array<String>();
  isLoggedIn:boolean=false;

  sortedData = new Array<StatisticheImmagini>();
  dataSource = new MatTableDataSource<StatisticheImmagini>();
  dungeons = new Array<Dungeon>();
  guilds = new Array<ServerDiscord>();
  convalidati = false;
  statisticheImmagini = new Array<StatisticheImmagini>();
  validatore = new Array<ValidaLookup>();

  constructor(public utils:Utils, public service: MacroService, public dialog: MatDialog, private statisticheService:StatisticheService, private activated:ActivatedRoute){
  }

  ngOnInit(): void {
    this.getDungeons();
    this.getGuilds();
    this.getContest();
    this.getValidatore();
      this.tipologieMacro=this.service.GetTipologieMacro().slice();
      this.tipologieMacro.push('Tutte');
      this.macroFullForm.get('tipologia')?.setValue('Tutte');
  }

  getContest()
  {
    const ref=this.statisticheService.getContest()
      .subscribe(x=>{
        this.statisticheImmagini=x;
        this.dataSource = new MatTableDataSource<StatisticheImmagini>(x.filter(x=> x.inAttesaDiValidazione==!this.convalidati));
          this.sortedData = this.dataSource.data.slice();
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        ref.unsubscribe();
      })
  }

  getDungeons()
  {
    const ref=this.statisticheService.getDungeons()
      .subscribe(x=>{
        this.dungeons=x;
        ref.unsubscribe();
      })
  }

  getGuilds()
  {
    const ref=this.statisticheService.getGuilds()
      .subscribe(x=>{
        this.guilds=x;
        ref.unsubscribe();
      })
  }
  getValidatore()
  {
    this.validatore.push(new ValidaLookup("✅","Convalida"),new ValidaLookup("❌","Respingi"),)
  }

  valida(row:StatisticheImmagini, valid:ValidaLookup)
  {
    const dialogRef = this.dialog.open(ModaleSiNoComponent, {
      data: { message: "Sei sicuro di voler modificare lo stato? L'azione è irreversibile." }
    });
    dialogRef.afterClosed().subscribe(si=>{
      if(si)
      {
        var validazione = valid.value=="Convalida" ? true : false;
        this.statisticheService.validaImmagini(row.statistica.id!.toString(), validazione).subscribe(x=>{
          this.getContest();
        })
      }
    })
  }


  applyFilter(x:any, y:string)
  {
    switch(y)
    {
      case "dungeons": 
        let filterDungeon = x as string;
        this.dataSource = new MatTableDataSource<StatisticheImmagini>(this.statisticheImmagini.filter(x=> x.statistica.destination==filterDungeon));
        break;
      case "servers":
        let filterServer = x as string;
        this.dataSource = new MatTableDataSource<StatisticheImmagini>(this.statisticheImmagini.filter(x=> x.statistica.guildId==filterServer));
        break;
      case "convalidati":
        let filterValidati = x as boolean;
        this.dataSource = new MatTableDataSource<StatisticheImmagini>(this.statisticheImmagini.filter(x=> x.validazione==filterValidati));
        break;
    }
    this.sortedData = this.dataSource.data.slice();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  sortData(sort: Sort) {
    // const data = this.dataSource.data.slice();
    // if (!sort.active || sort.direction === '') {
    //   this.sortedData = data;
    //   return;
    // }
    // this.sortedData = data.sort((a, b) => {
    //   const isAsc = sort.direction === 'asc';
    //   switch (sort.active) {
    //     case 'author':
    //       return this.compare(a.author, b.author, isAsc);
    //     case 'like':
    //       return this.compare(a.like, b.like, isAsc);
    //     case 'title':
    //       return this.compare(a.title, b.title, isAsc);
    //     case 'tiplogia':
    //       return this.compare(a.tipologia, b.tipologia, isAsc);
    //     default:
    //       return 0;
    //   }
    // });
    // this.dataSource.data=this.sortedData;
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

getDisplayedColumns()
{
    var columnsSmartphone = ['autore','tipologia','title','like'];
    return this.utils.isSmartphone() ? columnsSmartphone : this.displayedColumns;
}

detailStatistica(element: StatisticheImmagini)
{
  const dialogRef = this.dialog.open(ContainerStatisticheValidatoreComponent, {
    data: {
      statistica: new FullStatistica(element.statistica,new MedieStatistiche()),
      immagini: element.imgs
    },
    width:'43%',
    height:'54vh'
  });
  dialogRef.afterClosed().subscribe(x=>{
    console.log(x)
  })
}

reset()
{
  this.macroFullForm = new FormGroup({
    author: new FormControl(''),
    macro: new FormControl(''),
    tipologia: new FormControl('')
  });
  this.convalidati=false;
  this.dataSource = new MatTableDataSource<StatisticheImmagini>(this.statisticheImmagini.filter(x=> x.inAttesaDiValidazione==!this.convalidati));
  this.sortedData = this.dataSource.data.slice();
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}
}
export class ValidaLookup
{
  constructor(public emoji?:string, public value?:string) {
  }
}
