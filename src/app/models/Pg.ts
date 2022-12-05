export class Pg
{
  nome: string = "";
  cognome: string = "";
  classe: Classe = new Classe();
  skills = new Array<SkillChecked>();
  razza = new Razza;
  stats = new Stats();
  weight: [number,number] =  [0,0];
  divinita: string = "";
  malusMagico: number = 0;
  religione = new Religione();
}

export class Religione
{
  id: number = 0;
  nome: string = "";
  pantheon: string = "";
}

export class Razza
{
  id: number = 0;
  nome: string = "";
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
}

export class ClasseCheckBox extends Classe
{
  isChecked: boolean = false;

}
