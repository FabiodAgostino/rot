export class ValoriGrafico
{
  guid:any;
  y?: number;
  x?: string;
  constructor(values:number, date?:Date, guid?:any) {
    this.y=values;
    this.x=date?.getDate() + "/"+date?.getMonth();
    this.guid=guid;
  }
}