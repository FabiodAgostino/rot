import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Classe, ClasseCheckBox, Skill, TipologiaSkill } from '../models/Pg';
import { SchedaPersonaggioService } from '../service/scheda-personaggio.service';

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
  constructor(private service: SchedaPersonaggioService){}


  ngOnInit(): void {
    const config = require("../../environments/version.json");
    this.develop=config.develop;


    this.service.getAllSkills().subscribe(x=> this.skills=x);
    this.service.getAllClass().subscribe(x=>{ this.classi=x});
    this.service.getAllTipologieSkill().subscribe(x=> this.tipologiaSkills=x);
    console.log(this.newSkill)
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

}
