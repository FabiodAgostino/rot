import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Classe, ClasseCheckBox, Skill, TipologiaSkill } from '../models/Pg';
import { User } from '../models/User';
import { SchedaPersonaggioService } from '../service/scheda-personaggio.service';
import { UserService } from '../service/user.service';
import { Utils } from '../utils/utility';

@Component({
  selector: 'app-develop',
  templateUrl: './develop.component.html',
  styleUrls: ['./develop.component.css']
})
export class DevelopComponent implements OnInit{

  skills = new  Array<Skill>();
  newSkill = new Skill();
  classi = new Array<Classe>();
  tipologiaSkills = new Array<TipologiaSkill>();
  idsClassiScelte = new Array<number>();
  notChecked=false;
  develop = false;
  user = new User();
  constructor(private service: SchedaPersonaggioService, private userService: UserService, private utils: Utils){}


  ngOnInit(): void {
    const config = require("../../environments/version.json");
    this.develop=config.develop;


    this.service.getAllSkills().subscribe(x=> this.skills=x);
    this.service.getAllClass().subscribe(x=>{ this.classi=x});
    this.service.getAllTipologieSkill().subscribe(x=> this.tipologiaSkills=x);

    this.discord();
  }

  SalvaSkill()
  {
    const skill = this.newSkill;
    skill.nome=(skill.nome.charAt(0).toUpperCase() + skill.nome.slice(1)).trim();
    this.service.AddSkill(this.newSkill);
    this.service.getAllClass().subscribe(x=>{ this.classi=x});
    this.newSkill = new Skill();
  }

  toggle(classe: Classe)
  {
    this.newSkill.classi.push(classe.nome);
  }

  checkSession()
  {
    this.userService.checkSession();
  }

  logout()
  {
    this.userService.logout();
  }

  registrati()
  {
    this.userService.registrati(this.user);
  }

  login()
  {
    this.userService.login(this.user).subscribe(x=> alert(x));
  }

  area = "";
  goText()
  {
    this.utils.MacrosXmlToObject(this.area);
  }

  discord()
  {
    var code=this.userService.getQueryParams();
    if(code)
      this.userService.loginDiscord(code);
  }
}
