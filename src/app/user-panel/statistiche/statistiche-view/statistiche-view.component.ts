import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Dungeon, FullStatistica, MedieStatistiche, Statistiche } from 'src/app/models/Statistiche';
import { StatisticheService } from 'src/app/service/statistiche.service';
import { UserService } from 'src/app/service/user.service';
import { Utils } from 'src/app/utils/utility';
import { ModaleStatisticheComponent } from '../modale-statistiche/modale-statistiche.component';
import { EMPTY, Observable, Subject, catchError, combineLatest, concatMap, filter, forkJoin, from, map, of, toArray } from 'rxjs';
import { ContainerModaleStatisticheComponent } from '../container-modale-statistiche/container-modale-statistiche.component';


@Component({
  selector: 'app-statistiche-view',
  templateUrl: './statistiche-view.component.html',
  styleUrls: ['./statistiche-view.component.css']
})
export class StatisticheViewComponent implements OnInit {

  constructor(public userService: UserService, private statisticheService: StatisticheService, public utils:Utils, private dialog: MatDialog) {
  }

  dungeons = new Array<Dungeon>();
  selectedDungeon = new Dungeon("","Tutti");
  arrayMedie = new Array<MedieStatistiche>();

  selectedDate: string ="2023-10";
  year = parseInt(this.selectedDate.split("-")[0]);
  month = parseInt(this.selectedDate.split("-")[1]);
  annoIntero:boolean=false;

  arrayStatistiche = new Array<Statistiche>();
  arrayAllStatistiche = new Array<Statistiche>();
  tipoGrafico = [{tipo:"Lineare",emoji:"📈"},{tipo:"Timeline",emoji:"↔️"}];
  filtriGrafico = ["⬆️ Fama","🪙 Monete","❄️ Frammenti","⚗️ Sangue","🔮 Nuclei","🕙 Tempo","⚔️ Numero utenti"]
  selectedGrafico = "Lineare";
  selectedFiltro:string = "⬆️ Fama";
  statistica = new Statistiche();
  valoriGrafico = new Array<number>();
  isLoading = true;
  noData = false;
  
  ngOnInit(): void 
  {
    this.getStatistiche();
    this.statisticheService.getDungeons().subscribe(x=> {
      this.dungeons=x;
      this.dungeons.push(new Dungeon("","Tutti"));
    });
    if(this.utils.isSmartphone())
      this.selectedGrafico="Lineare"
  }
  
 

  onDateChange() {
    const date = this.selectedDate.split("-");
    this.year = parseInt(date[0]);
    this.month = parseInt(date[1]);
    this.getStatistiche();
  } 

  getStatistiche()
  {
    this.noData=false;
    this.isLoading=true;
    const guildId = this.userService.userLoggato?.guildId;
    this.statisticheService.getCacciaOrganizzataTempoLoot(guildId!,this.month,this.year, this.annoIntero).subscribe(x=> {
      {
        const array = x.filter(x=> x.tempo!=undefined);
        this.arrayAllStatistiche=array; 
        this.arrayStatistiche=array;
        this.isLoading=false;
        if(array.length==0)
          this.noData=true;
      }
    });
  }
  change()
  {
    if(this.selectedDungeon.name!="Tutti")
      this.arrayStatistiche=this.arrayAllStatistiche.filter(x=> x.destination==this.selectedDungeon.name);
    else
      this.arrayStatistiche=this.arrayAllStatistiche;
  }

  goToOpenModal(items: Array<Statistiche>): Observable<FullStatistica[]> {
    const observables: Observable<FullStatistica>[] = [];
  
    items.forEach(item => {
      if (this.arrayMedie.some(x => x.dungeon == item.destination)) {
        const object = this.arrayMedie.find(x => x.dungeon == item.destination);
        const fullStatistica = new FullStatistica(item, object!);
        observables.push(of(fullStatistica));
      } else {
        const observable = this.statisticheService.getMedie(item.guildId!, item.destination!).pipe(
          map((x) => new FullStatistica(item, x)),
          catchError((error) => {
            console.error('Errore durante il recupero dei dati:', error);
            return EMPTY; // Utilizziamo EMPTY per rimuovere il risultato in caso di errore
          })
        );
        observables.push(observable);
      }
    });
    return combineLatest(observables);
  }
  

  setValuesModal(items: Array<Statistiche>)
  {
    const ref=this.goToOpenModal(items).subscribe(x=> {
      this.openModal(x)
      ref.unsubscribe();
    })
  }


  openModal(fullStatistiche:Array<FullStatistica>)
  {
    this.dialog.open(ContainerModaleStatisticheComponent,{
      data:fullStatistiche,
      width:"800px",
      height:fullStatistiche.length>1 ? '490px' : '460px'
    });
  }

  notAviable()
  {
    if(this.utils.isSmartphone())
    {
      alert("Attualmente non disponibile per smartphone.")
    }
  }

  setAnnoCorrente(value:any)
  {
    this.annoIntero=value;
    this.getStatistiche();
  }

}


