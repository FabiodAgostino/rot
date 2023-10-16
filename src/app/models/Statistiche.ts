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