export class Pg
{
  nome: string = "";
  classe: Classe = new Classe();
  skills = new Array<SkillChecked>();
  razza = new Razza;
  stats = new Stats();
  malusMagico: number = 0;
  religione = new Religione();
  guid: string ="";
}

export class PartialPg
{
  nome: string = "";
  classe = "";
  razza = "";
  forza = 0;
  destrezza= 0;
  intelligenza= 0;
  divinita = "";
  pantheon = "";
  guid = "";

  static Convert(partialPg: PartialPg, skills: Array<SkillsPg>) : Pg
  {
    let pg = new Pg();

    pg.nome=partialPg?.nome;
    pg.stats = new Stats(partialPg?.forza,partialPg?.destrezza,partialPg?.intelligenza);
    pg.religione = new Religione(partialPg?.divinita);

    skills.forEach(x=>{
      let skill = new SkillChecked();
      skill.nome=x?.nomeSkill;
      skill.value=x?.valueSkill;
      skill.isChecked=true;
      skill.idTipologiaSkill=x.idTipologiaSkill;
      skill.id=x.idSkill;
      pg.skills.push(skill);
    });

    pg.guid=partialPg?.guid;

    pg.razza = new Razza(partialPg?.razza);

    pg.classe = new Classe(0,partialPg?.classe);

    return pg;
  }


}

export class SkillsPg
{
  guidPg: string = "";
  nomeSkill: string = "";
  valueSkill: number = 0;
  idTipologiaSkill: number = 0;
  idSkill: number=0;
}

export class SpellPaladino
{
  id: number = 0;
  religione: string =" ";
  spell = Array<string>();
  aura: string = " ";
}

export class SpellChierico
{
  id: number = 0;
  religione: string =" ";
  spell = Array<string>();
}

export class Religione
{
  id: number = 0;
  nome: string = "";
  pantheon: string = "";

  constructor(_nome?: string)
  {
    if(_nome)
    {
      this.nome=_nome;
    }
  }
}

export class Razza
{
  id: number = 0;
  nome: string = "";

  constructor(_nome?: string)
  {
    if(_nome)
      this.nome=_nome;
  }
}
export class Classe
{
  id : number = 0;
  nome: string = "";
  notRazze = new Array<string>();
  constructor(id?: any, nome?: any)
  {
    this.id=id;
    this.nome=nome;
  }

  static convertClasse(classe: Classe) : ClasseCheckBox
  {
    return new ClasseCheckBox(classe.id,classe.nome);
  }
}

export class Skill
{
  nome: string = "";
  id: number = 0;
  classi = new Array<string>();
  idTipologiaSkill:number = -1;


  static ConvertToSkillsChecked(skills: Array<Skill>)
  {
    let skillsChecked = new Array<SkillChecked>();
    skills.forEach(x=>{
      let skillChecked = new SkillChecked();
      skillChecked.id=x.id;
      skillChecked.nome=x.nome;
      skillChecked.idTipologiaSkill= x.idTipologiaSkill;
      skillChecked.classi = x.classi;
      skillsChecked.push(skillChecked);
    });
    return skillsChecked;
  }
}

export class SkillChecked extends Skill
{
  isChecked: boolean= false;
  value: number = 0;
}

export class TipologiaSkill
{
  id: number = -1;
  nome: string = "";
}

export class Stats
{
  forza: number = 0;
  destrezza: number = 0;
  intelligenza: number = 0;

  constructor(_forza?: number, _destrezza?: number, _intelligenza?: number)
  {
    if(_forza && _destrezza && _intelligenza)
    {
      this.forza=_forza;
      this.destrezza=_destrezza;
      this.intelligenza=_intelligenza;
    }
  }
}

export class ClasseCheckBox extends Classe
{
  isChecked: boolean = false;

}
