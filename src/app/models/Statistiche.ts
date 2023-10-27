export class FullStatistica
{
    statistica?: Statistiche;
    media?: MedieStatistiche;
    constructor(statistica:Statistiche,media:MedieStatistiche) {
        this.statistica=statistica;
        this.media=media;
    }
}

export class Statistiche
{
    id?:number;
    dateFinish: any;
    guid?: string;
    guildId?: string;
    guildName?: string;
    monete?: number;
    fama?: number;
    nuclei?: number;
    sangue?: number;
    date: any;
    userList?: Array<string>;
    userRole?: Array<string>;
    tempo?: TempoCaccia;
    destination?: string;
    frammenti?: number;
    numPg?:number;
}

export class StatisticheImmagini
{
    statistica:Statistiche;
    imgs:Array<string>;
    inAttesaDiValidazione:boolean;
    validazione:boolean;
    constructor(statistica:Statistiche, arrayImg:Array<string>, inAttesaDiValidazione:boolean, validazione:boolean) {
        this.statistica=statistica;
        this.imgs=arrayImg;
        this.inAttesaDiValidazione=inAttesaDiValidazione;
        this.validazione=validazione;
    }
}
export class ImmaginiContest
{
   constructor(public idCacciaOrganizzataTempoLoot:string, public images:Array<string>,public inAttesaDiValidazione:boolean,public validazione:boolean)
   {} 
}

export class TempoCaccia
{
    hours:number;
    minutes:number;
    seconds:number;
    constructor(hours:number,minutes:number,seconds:number) {
        this.hours=hours;
        this.minutes=minutes;
        this.seconds=seconds;
    }
}

export class Dungeon
{
    public emoji?:string;
    public name?:string;
    constructor(emoji?:string, name?:string) {
        this.emoji=emoji;
        this.name=name;
    }
}

export class MedieStatistiche
{
    nVolte:number = 0;
    dungeon?:string;
    fama:number =0;
    monete:number = 0;
    frammenti:number= 0;
    tempo!:TempoCaccia;
    sangue:number = 0;
    nuclei:number = 0;
    numeroPg?:number;
    userList?:string[];
    constructor() {
    }
}