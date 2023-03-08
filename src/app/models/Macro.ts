import { Timestamp } from "firebase/firestore";

export class Macro
{
  guid: string = '';
  author: string ="";
  date: Date = new Date();
  title: string = "";
  like: number =0;
  tipologia: string ="";
  dateTimeStamp : any;
  utenti = new Array<string>();
}

export class MacroFull
{
  macro: Macro = new Macro();
  azione: string="";
  value:string="";
  descrizione: string="";
  tipologia: string ="";
}

export class MacroSettings
{
  comando: string ="";
  settings = new Array<string>();
  type: string ="";
}

export class MacroSettingsFront extends MacroSettings
{
  function: string = "";
  index:number =0;
}

export class MacroToInsert
{
  settings = new Array<MacroSettingsFront>();
  macro = new Macro();
  descrizione: string = "";
}

export class MacroFirebase extends Macro
{
  descrizione: string = "";
}

export class MacroLike
{
  guid: string ="";
  utente: string="";
}

export class MacroFullFromXml extends MacroToInsert
{
  checked: boolean=true;
}
