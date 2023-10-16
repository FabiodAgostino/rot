import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Dungeon, FullStatistica, MedieStatistiche, Statistiche } from 'src/app/models/Statistiche';
import { StatisticheService } from 'src/app/service/statistiche.service';
import { UserService } from 'src/app/service/user.service';
import { Utils } from 'src/app/utils/utility';
import { ModaleStatisticheComponent } from '../modale-statistiche/modale-statistiche.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-statistiche-view',
  templateUrl: './statistiche-view.component.html',
  styleUrls: ['./statistiche-view.component.css']
})
export class StatisticheViewComponent implements OnInit {

  constructor(private userService: UserService, private statisticheService: StatisticheService, public utils:Utils, private dialog: MatDialog) {
  }

  dungeons = new Array<Dungeon>();
  selectedDungeon = new Dungeon("","Tutti");
  arrayMedie = new Array<MedieStatistiche>();

  selectedDate: string ="2023-10";
  year = parseInt(this.selectedDate.split("-")[0]);
  month = parseInt(this.selectedDate.split("-")[1]);


  arrayStatistiche = new Array<Statistiche>();
  arrayAllStatistiche = new Array<Statistiche>();
  tipoGrafico = ["Timeline","Lineare"];
  filtriGrafico = ["Fama","Monete","Frammenti","Sangue","Nuclei"]
  selectedGrafico = "Timeline";
  selectedFiltro:string = "Fama";
  statistica = new Statistiche();
  valoriGrafico = new Array<number>();
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
    const guildId = this.userService.userLoggato?.guildId;
    this.statisticheService.getCacciaOrganizzataTempoLoot(guildId!,this.month,this.year).subscribe(x=> {this.arrayAllStatistiche=x; this.arrayStatistiche=x;});
  }
  change()
  {
    if(this.selectedDungeon.name!="Tutti")
      this.arrayStatistiche=this.arrayAllStatistiche.filter(x=> x.destination==this.selectedDungeon.name);
    else
      this.arrayStatistiche=this.arrayAllStatistiche;
  }

  goToOpenModal(item:Statistiche)
  {
    if(this.arrayMedie.some(x=> x.dungeon==item.destination))
    {
      var object=this.arrayMedie.filter(x=> x.dungeon==item.destination)[0];
      const fullStatistica=new FullStatistica(item,object);
      this.openModal(fullStatistica);
    }
    else
    {
      const response = this.statisticheService.getMedie(item.guid!, item.destination!).subscribe(x=>{
        this.arrayMedie.push(x);
        const fullStatistica=new FullStatistica(item,x);
        this.openModal(fullStatistica);
        response.unsubscribe();
      })
    }
  }


  openModal(fullStatistica:FullStatistica)
  {
    this.dialog.open(ModaleStatisticheComponent,{
      data:fullStatistica,
      width:"500px",
      height:"400px"
    });
  }

  notAviable()
  {
    if(this.utils.isSmartphone())
    {
      alert("Attualmente non disponibile per smartphone.")
    }
  }

}


