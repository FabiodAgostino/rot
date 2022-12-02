export class Pg
{
  nome: string = "";
  cognome: string = "";
  classe: Classe = new Classe();
  skills = new Array<Skill>();
  stats = new Stats();
  weight: [number,number] =  [0,0];
  divinita: string = "";
  malusMagico: number = 0;
}


export class Classe
{
  nome: string = "";
}

export class Skill
{
  nome: string = "";
  value: number = 0;
}

export class Stats
{
  forza: number = 0;
  destrezza: number = 0;
  intelligenza: number = 0;
}
