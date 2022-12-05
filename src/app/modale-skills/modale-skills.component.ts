import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Classe, Pg, Skill, SkillChecked, TipologiaSkill } from '../models/Pg';
import { SchedaPersonaggioService } from '../service/scheda-personaggio.service';
import { Utils } from '../utils/utility';

@Component({
  selector: 'app-modale-skills',
  templateUrl: './modale-skills.component.html',
  styleUrls: ['./modale-skills.component.css']
})
export class ModaleSkillsComponent implements OnInit {

  constructor(private service: SchedaPersonaggioService, private utils: Utils, public dialogRef: MatDialogRef<ModaleSkillsComponent>, @Inject(MAT_DIALOG_DATA)
  public data: Pg)
  {
    this.classe=data?.classe;
    this.skills = data?.skills;
  }
  classe = new Classe();
  tipologieSkill = new Array<TipologiaSkill>();
  skillDiClasse = new Array<SkillChecked>();
  combattive = new Array<SkillChecked>();
  miscellanee = new Array<SkillChecked>();
  musicali = new Array<SkillChecked>();
  magiche = new Array<SkillChecked>();
  lavorative = new Array<SkillChecked>();
  conoscitive = new Array<SkillChecked>();
  skillForm = new FormControl(0, [Validators.required]);
  arraySkills = new Array<Array<SkillChecked>>();
  valueTotale = 0;
  salva = false;
  skillScelte = new Array<SkillChecked>();
  isSmartphone = false;
  skills = new Array<SkillChecked>();

  ngOnInit(): void {


    this.isSmartphone=this.utils.isSmartphone();
    this.reload();
  }


  setSkill(skill: SkillChecked)
  {
    if(skill.isChecked)
    {
      skill.isChecked=false;
      skill.value=0;
      this.removeSkill(skill);
    }
    else
    {
      skill.isChecked=true;
      skill.value=100;
      this.skillScelte.push(skill);
    }
    this.resultSkills();
  }

  checkNumber(skill: SkillChecked)
  {
    let notLavorativa=skill.nome.toLowerCase()=="cercare minerali" || skill.nome.toLowerCase()=="fare legna" || skill.nome.toLowerCase()=="pescare" || skill.nome.toLowerCase()=="erboristeria"
      || skill.nome.toLowerCase()=="agricoltura";
    if(skill.idTipologiaSkill==0 && skill.value>200 && !notLavorativa)
        skill.value=200;
    if((skill.idTipologiaSkill>0 || notLavorativa) && skill.value>100)
      skill.value=100;
    if(skill.value<0)
      skill.value=0;

    this.updateSkill(skill);
    this.resultSkills();
  }

  getStandardSkills(a: Array<Skill>)
  {
    let array = Skill.ConvertToSkillsChecked(a);
    array.forEach(x=> { x.value=100; x.isChecked=true});
    return array;
  }

  setStandardSkills(skills: Array<SkillChecked>, value = -1)
  {

    this.skillDiClasse.forEach(x=>{
    let cmb=skills.findIndex(z=> z.id==x.id);
    if(cmb!=-1)
    {
      if(value==-1)
      {
        skills[cmb].isChecked=true;
        skills[cmb].value=100;
      }
      else
      {
        skills[cmb].isChecked=false;
        skills[cmb].value=0;
      }
    }
    });
    return skills;
  }

  setAll(event: MatCheckboxChange){
    if ( event.checked ) {
      this.lavorative=this.setStandardSkills(this.lavorative);
      this.combattive=this.setStandardSkills(this.combattive);
      this.magiche=this.setStandardSkills(this.magiche);
      this.conoscitive=this.setStandardSkills(this.conoscitive);
      this.miscellanee=this.setStandardSkills(this.miscellanee);
      this.musicali=this.setStandardSkills(this.musicali);
      this.getSkillsChecked();
   }
   else
  {
    this.lavorative=this.setStandardSkills(this.lavorative,1);
      this.combattive=this.setStandardSkills(this.combattive,1);
      this.magiche=this.setStandardSkills(this.magiche,1);
      this.conoscitive=this.setStandardSkills(this.conoscitive,1);
      this.miscellanee=this.setStandardSkills(this.miscellanee,1);
      this.musicali=this.setStandardSkills(this.musicali,1);
  }
  this.resultSkills();
  }

  resultSkills()
  {
    this.valueTotale = 0;
    this.valueTotale +=this.lavorative.reduce((partialSum, a) => partialSum + a.value, 0);
    this.valueTotale +=this.combattive.reduce((partialSum, a) => partialSum + a.value, 0);
    this.valueTotale +=this.miscellanee.reduce((partialSum, a) => partialSum + a.value, 0);
    this.valueTotale +=this.magiche.reduce((partialSum, a) => partialSum + a.value, 0);
    this.valueTotale +=this.musicali.reduce((partialSum, a) => partialSum + a.value, 0);
    this.valueTotale +=this.conoscitive.reduce((partialSum, a) => partialSum + a.value, 0);

  }

  reload()
  {
    this.service.getClasseSkills(this.classe.nome).subscribe(x=>
      {
        this.skillDiClasse=this.getStandardSkills(x);
          this.service.getAllSkills(0).subscribe(u=> {this.lavorative=Skill.ConvertToSkillsChecked(u); this.reloadSkills(this.lavorative)});
          this.service.getAllSkills(1).subscribe(u=> {this.combattive=Skill.ConvertToSkillsChecked(u); this.reloadSkills(this.lavorative)});
          this.service.getAllSkills(2).subscribe(u=> {this.magiche=Skill.ConvertToSkillsChecked(u); this.reloadSkills(this.lavorative)});
          this.service.getAllSkills(3).subscribe(u=> {this.conoscitive=Skill.ConvertToSkillsChecked(u); this.reloadSkills(this.lavorative)});
          this.service.getAllSkills(4).subscribe(u=> {this.miscellanee=Skill.ConvertToSkillsChecked(u); this.reloadSkills(this.lavorative)});
          this.service.getAllSkills(5).subscribe(u=> {this.musicali=Skill.ConvertToSkillsChecked(u); this.reloadSkills(this.lavorative)});
      });
  }

  removeSkill(skill: SkillChecked)
  {
    this.skillScelte=this.skillScelte.filter(x=> x.id!==skill.id);
  }

  updateSkill(skill: SkillChecked)
  {
    var i=this.skillScelte.findIndex(x=> x.id==skill.id);
    this.skillScelte[i].value=skill.value;
  }

  getSkillsSelected()
  {
  }


  salvaSkills()
  {
    this.dialogRef.close({data: this.skillScelte});
  }

  reloadSkills(array: Array<SkillChecked>)
  {
    if(this.skills.length>0)
    {
    this.skills.forEach(x=>{
      let i =array.findIndex(y=> y.id==x.id);
      if(array[i]?.value!==undefined)
      {
        array[i].value=x.value;
        array[i].isChecked = x.isChecked;
      }
    });
    console.log(array);
    this.resultSkills();
    }
  }

  getSkillsChecked()
  {
    this.skillScelte = new Array<SkillChecked>();
    this.skillScelte=this.skillScelte.concat(this.lavorative.filter(x=> x.isChecked && x.value>0));
    this.skillScelte=this.skillScelte.concat(this.combattive.filter(x=> x.isChecked && x.value>0));
    this.skillScelte=this.skillScelte.concat(this.magiche.filter(x=> x.isChecked && x.value>0));
    this.skillScelte=this.skillScelte.concat(this.conoscitive.filter(x=> x.isChecked && x.value>0));
    this.skillScelte=this.skillScelte.concat(this.musicali.filter(x=> x.isChecked && x.value>0));
    this.skillScelte=this.skillScelte.concat(this.miscellanee.filter(x=> x.isChecked && x.value>0));
  }
}
