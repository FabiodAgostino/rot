import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Classe, Pg, Razza, Religione, Skill } from '../models/Pg';
import { SchedaPersonaggioService } from '../service/scheda-personaggio.service';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { ModaleSkillsComponent } from '../modale-skills/modale-skills.component';


@Component({
  selector: 'app-scheda-personaggio',
  templateUrl: './scheda-personaggio.component.html',
  styleUrls: ['./scheda-personaggio.component.css']
})
export class SchedaPersonaggioComponent implements OnInit {

  statsChecked = false;
  colorBar = "primary";
  schedaPg = new Pg();
  classi = new Array<Classe>();
  razze = new Array<Razza>();
  religioni = new Array<Religione>();
  skills = new Array<Skill>();
  skillConsigliate = new Array<Skill>();
  nomeForm = new FormControl('', [Validators.required, Validators.minLength(3)]);
  classeForm = new FormControl(new Classe(), [Validators.required]);
  razzaForm = new FormControl(new Razza(), [Validators.required]);
  religioneForm = new FormControl(new Razza(), [Validators.required]);

  forzaForm = new FormControl(0, [Validators.required, Validators.minLength(1),Validators.maxLength(3)]);
  destrezzaForm = new FormControl(0, [Validators.required, Validators.minLength(1),Validators.maxLength(3)]);
  intelligenzaForm = new FormControl(0, [Validators.required, Validators.minLength(1),Validators.maxLength(3)]);

  totaleStat = 0;


  constructor(private service: SchedaPersonaggioService, private dialog: MatDialog){}

  ngOnInit(): void {
    this.service.getAllRazze().subscribe(x=> this.razze=x);
  }

  getReligioni()
  {
    if(this.schedaPg.classe.nome=='Druido')
    {
        this.service.getAllReligioni("Druidi").subscribe(x=> this.religioni=x);
        return;
    }
    if(this.schedaPg.classe.nome!=='Druido')
    {
      switch(this.schedaPg.razza.nome)
      {
        case("Quenya"):
        case("Telero"):
        case("Sindar"): this.service.getAllReligioni("Elfico").subscribe(x=> this.religioni=x); break;
        case("Umano comune"): this.service.getAllReligioni("Umano").subscribe(x=> this.religioni=x); break;
        case("Nordico"): this.service.getAllReligioni("Nordico").subscribe(x=> this.religioni=x); break;
        case("Nano"): this.service.getAllReligioni("Nanico").subscribe(x=> this.religioni=x); break;
        case("Tremecciano"): this.service.getAllReligioni("Tremecciano").subscribe(x=> this.religioni=x); break;
        case("Qwaylar"): this.service.getAllReligioni("Qwaylar").subscribe(x=> this.religioni=x); break;
        case("Mezz'elfo"): this.service.getAllReligioni().subscribe(x=> this.religioni=x);break;
      }
    }
  }

  selectSkills()
  {
    const dialog=this.dialog.open(ModaleSkillsComponent,{data: this.schedaPg});

    dialog.afterClosed().subscribe(x=>
      {
        this.schedaPg.skills=x.data;
      });
  }

  filterClassi(array: Array<Classe>)
  {
    var x= array.filter(x=> {
        return x?.notRazze==undefined || !x.notRazze.includes(this.schedaPg.razza.nome)
    });
    return x;
  }

  getClassi()
  {
    this.service.getAllClass().subscribe(x=> this.classi=this.filterClassi(x));
  }

  checkForza()
  {
    if(this.schedaPg.stats.forza>120)
      this.schedaPg.stats.forza=120;
    if(this.schedaPg.stats.forza<0)
      this.schedaPg.stats.forza=1;
    this.totStat();
  }
  checkDestrezza()
  {
    if(this.schedaPg.stats.destrezza>120)
      this.schedaPg.stats.destrezza=120;
    if(this.schedaPg.stats.destrezza<0)
      this.schedaPg.stats.destrezza=1;
    this.totStat();

  }
  checkIntelligenza()
  {
    if(this.schedaPg.stats.intelligenza>120)
      this.schedaPg.stats.intelligenza=120;
    if(this.schedaPg.stats.intelligenza<0)
      this.schedaPg.stats.intelligenza=1;
    this.totStat();
  }

  autoSetStat()
  {
    if (this.statsChecked)
    {
      switch(this.schedaPg.classe.nome)
      {
        case "Guerriero":
        case "Berserker": this.schedaPg.stats.forza=120; this.schedaPg.stats.destrezza=79; this.schedaPg.stats.intelligenza=1; break;
        case "Mago": this.schedaPg.stats.forza=70; this.schedaPg.stats.destrezza=10; this.schedaPg.stats.intelligenza=120; break;
        case "Paladino": this.schedaPg.stats.forza=100; this.schedaPg.stats.destrezza=70; this.schedaPg.stats.intelligenza=30; break;
        case "Ranger": this.schedaPg.stats.forza=79; this.schedaPg.stats.destrezza=120; this.schedaPg.stats.intelligenza=1; break;
        case "Chierico": this.schedaPg.stats.forza=79; this.schedaPg.stats.destrezza=10; this.schedaPg.stats.intelligenza=120; break;
        case "Geniere": this.schedaPg.stats.forza=79; this.schedaPg.stats.destrezza=120; this.schedaPg.stats.intelligenza=1; break;
        case "Bardo": this.schedaPg.stats.forza=99; this.schedaPg.stats.destrezza=100; this.schedaPg.stats.intelligenza=1; break;
        default:
          this.schedaPg.stats.forza=0;
          this.schedaPg.stats.intelligenza=0;
          this.schedaPg.stats.destrezza=0;
          break;
      }
    }
    else
    {
      this.schedaPg.stats.forza=0;
      this.schedaPg.stats.intelligenza=0;
      this.schedaPg.stats.destrezza=0;
    }
      this.totStat();
  }

  totStat()
  {
    this.totaleStat=this.schedaPg.stats.forza+this.schedaPg.stats.destrezza+this.schedaPg.stats.intelligenza;
    this.colorBar = this.totaleStat>200 && this.totaleStat<215 ? 'accent' : this.totaleStat>215 ? 'warn' : 'primary';
  }

}
