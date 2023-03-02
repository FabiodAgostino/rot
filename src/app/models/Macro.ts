export class Macro
{
  id: number = 0;
  author: string ="";
  date: Date = new Date();
  macro: string = "";
  like: number =0;
  tipologia: string ="";
}

export class MacroFull
{
  macro: Macro = new Macro();
  azione: string="";
  value:string="";
  descrizione: string="";
  tipologia: string ="";
}

