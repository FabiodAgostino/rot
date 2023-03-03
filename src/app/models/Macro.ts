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
}

export class MacroToInsert
{
  settings = new Array<MacroSettings>();
  macro = new Macro();
  descrizione: string = "";
}

