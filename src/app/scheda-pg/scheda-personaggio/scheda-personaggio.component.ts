import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Classe, InfoSkill, PartialPg, Pg, Razza, Religione, Skill } from '../../models/Pg';
import { SchedaPersonaggioService } from '../../service/scheda-personaggio.service';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { ModaleSkillsComponent } from '../modale-skills/modale-skills.component';
import { ModalePaladinoComponent } from '../modale-paladino/modale-paladino.component';
import jsPDF from 'jspdf';
import { Router } from '@angular/router';
import { FinishWizardComponent } from '../finish-wizard/finish-wizard.component';
import { ModaleChiericoComponent } from '../modale-chierico/modale-chierico.component';
import { UserService } from 'src/app/service/user.service';
import { Utils } from 'src/app/utils/utility';
import { InfoSkillsComponent } from '../info-skills/info-skills.component';

const changedRazza = "changed";
const notChangedRazza= "notChanged";
const inizializeRazza = "";

@Component({
  selector: 'app-scheda-personaggio',
  templateUrl: './scheda-personaggio.component.html',
  styleUrls: ['./scheda-personaggio.component.css']
})
export class SchedaPersonaggioComponent implements OnInit {

  nomeForm = new FormControl();
  classeForm = new FormControl();
  razzaForm = new FormControl();
  religioneForm = new FormControl();
  forzaForm = new FormControl();
  destrezzaForm = new FormControl();
  intelligenzaForm = new FormControl();

  statsChecked = false;
  colorBar = "primary";
  schedaPg = new Pg();
  classi = new Array<Classe>();
  razze = new Array<Razza>();
  religioni = new Array<Religione>();
  skills = new Array<Skill>();
  skillConsigliate = new Array<Skill>();
  changeRazza = inizializeRazza;
  isDruido = false;
  infoSkills = new Array<InfoSkill>();
  totaleStat = 0;


  constructor(private service: SchedaPersonaggioService, private dialog: MatDialog, private userService: UserService, private utils: Utils){}

  ngOnInit(): void {
    this.resetFormControl();
    this.service.getAllRazze().subscribe(x=> this.razze=x);
  }

  getReligioni()
  {
    if(this.schedaPg.classe.nome=='Druido')
    {
        this.service.getAllReligioni("Druidi").subscribe(x=> this.religioni=x);
        this.isDruido=true;
        return;
    }

    if(this.schedaPg.classe.nome!=='Druido' && (this.changeRazza==changedRazza|| this.changeRazza==inizializeRazza) || this.isDruido)
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
      this.isDruido=false;
      this.changeRazza=notChangedRazza;
    }
  }

  selectSkills()
  {
    const dialog=this.dialog.open(ModaleSkillsComponent,{
      width: this.utils.isSmartphone() ? "80%" : "40%",
      data: this.schedaPg});

    dialog.afterClosed().subscribe(x=>
      {
        if(x?.data!==undefined)
          this.schedaPg.skills=x?.data;
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

  getInfoSkill()
  {
    this.service.getInfoSkill(this.schedaPg.classe.nome).subscribe(x=>{
      if(x.length>0)
        this.infoSkills=x;
      else
        this.infoSkills=new Array<InfoSkill>();
    });
  }

  openInfoSkills()
  {
    this.dialog.open(InfoSkillsComponent,{
      data: this.infoSkills,
      height:this.utils.isSmartphone() ? "60%" : "",
    })
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
        case "Mago":
        case "Chierico": this.schedaPg.stats.forza=70; this.schedaPg.stats.destrezza=10; this.schedaPg.stats.intelligenza=120; break;
        case "Paladino": this.schedaPg.stats.forza=100; this.schedaPg.stats.destrezza=70; this.schedaPg.stats.intelligenza=30; break;
        case "Ranger":
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

  openPaladino()
  {
    this.dialog.open(ModalePaladinoComponent,{data:this.schedaPg.religione.nome});
  }

  openChierico()
  {
    this.dialog.open(ModaleChiericoComponent,{data:this.schedaPg.religione.nome});
  }

  checkSalva()
  {
    const stats = this.schedaPg.stats;
    const religione = this.schedaPg.religione.nome;
    return stats.forza!==0 && stats.destrezza!==0 && stats.intelligenza!==0 && this.nomeForm.valid && religione!=='' && this.classeForm.valid && this.razzaForm.valid && this.schedaPg.skills.length>0;
  }

  savePg()
  {
    let guid=  crypto.randomUUID();
    this.service.AddPg(this.schedaPg,guid);

    this.schedaPg.skills.forEach(x=>{
      this.service.addSkillsPg(x,guid);
    })

      this.openFinishWizard(guid);
      this.reset();
  }

  reset()
  {
    this.totaleStat=0;
    this.schedaPg=new Pg();
    this.resetFormControl();
  }

  openFinishWizard(guid: string)
  {
    const dialog = this.dialog.open(FinishWizardComponent,
      {
        data:{pg:this.schedaPg, guid:guid, infoSkills: this.infoSkills}});
    dialog.afterOpened().subscribe(x=> this.infoSkills= new Array<InfoSkill>());
  }

  resetFormControl()
  {
    this.nomeForm = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.classeForm = new FormControl(null, [Validators.required]);
    this.razzaForm = new FormControl(null, [Validators.required]);
    this.religioneForm = new FormControl(null, [Validators.required]);
    this.forzaForm = new FormControl(0, [Validators.required, Validators.minLength(1),Validators.maxLength(3)]);
    this.destrezzaForm = new FormControl(0, [Validators.required, Validators.minLength(1),Validators.maxLength(3)]);
    this.intelligenzaForm = new FormControl(0, [Validators.required, Validators.minLength(1),Validators.maxLength(3)]);
  }

  recuperaScheda()
  {
    let guid=prompt("Inserisci il guid per recuperare una scheda già compilata");

    if(guid?.length==36)
    {
      this.getClassi();
      this.service.getPg(guid).subscribe(x=>
        {
          if(x[0]?.nome!==undefined)
              if(guid)
                this.service.getSkillsPg(guid).subscribe(y=>{
                    this.schedaPg = PartialPg.Convert(x[0],y);

                });
          else
            alert("Nessuna scheda pg presente col guid inserito.");

        });
    }
    else
    {
      if(guid)
        alert("Formato guid non valido");
    }
      setTimeout(() => {
        this.getReligioni();
      }, 500);
  }

  compareWith(object1: any) {
    return object1===this.schedaPg.religione.nome;
  }


  isChierico()
  {
    return this.schedaPg.classe.nome==='Chierico';
  }

  isLogged()
  {
    return this.userService.isLoggedIn;
  }

  isRotinrim()
  {
    return this.userService.isRotinrim;
  }

  spazioSmartphone()
  {
    let styles = {
      'margin': this.utils.isSmartphone() ? '4%' : '1%',
    };
    return styles;
  }





}
