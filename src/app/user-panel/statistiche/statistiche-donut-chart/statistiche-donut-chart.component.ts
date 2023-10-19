import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chart, Legend, Title, CategoryScale, Tooltip, DoughnutController, ArcElement} from 'chart.js';
import { Utils } from 'src/app/utils/utility';

Chart.register( Title, CategoryScale, Tooltip, DoughnutController,ArcElement, Legend);

@Component({
  selector: 'app-statistiche-donut-chart',
  templateUrl: './statistiche-donut-chart.component.html',
  styleUrls: ['./statistiche-donut-chart.component.css']
})
export class StatisticheDonutChartComponent implements OnChanges{

  constructor(public utils:Utils) {
  }
  public chart:any;
  public data = new Array<ValoriGraficoDonuts>();
  @Input() listClass = new Array<string>();
  ngOnChanges(changes: SimpleChanges): void {
    this.data = new Array<ValoriGraficoDonuts>();
    this.divideClass();
    this.createChart();
  }


  createChart(){
    
    if(this.chart)
    {
      this.chart.destroy();
    }
    
    let x=this.data.map(x=> x.x).filter(x=> x!=='0');
    let colorLabel = this.elaborateColorAndLabels();

    this.chart = new Chart("DonutChart", {
      type: 'doughnut', //this denotes tha type of chart
      data: {
        labels: colorLabel.map(x=> x.label),
        datasets: [
          {
            data:x,
            backgroundColor: colorLabel.map(x=> x.color),
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: true, // Imposta questo valore su true per visualizzare la legenda
          },
        }
      }
    });

    // if(this.valoriGrafico?.map(valore=> valore.y)?.every(x=> x==0))
    // {
    //   this.chart.destroy();
    //   return;
    // }
  }

  divideClass()
  {

    this.data.push(new ValoriGraficoDonuts(this.listClass.filter(x=> x.toLowerCase()==="prima linea").length.toString(),"Prima Linea"))
    this.data.push(new ValoriGraficoDonuts(this.listClass.filter(x=> x.toLowerCase()==="mago").length.toString(),"Mago"))
    this.data.push(new ValoriGraficoDonuts(this.listClass.filter(x=> x.toLowerCase()==="ranger").length.toString(),"Ranger"))
    this.data.push(new ValoriGraficoDonuts(this.listClass.filter(x=> x.toLowerCase()==="bardo").length.toString(),"Bardo"))
    this.data.push(new ValoriGraficoDonuts(this.listClass.filter(x=> x.toLowerCase()==="chierico").length.toString(),"Chierico"))
    this.data.push(new ValoriGraficoDonuts(this.listClass.filter(x=> x.toLowerCase()==="rogue").length.toString(),"Rogue"))
    this.data.push(new ValoriGraficoDonuts(this.listClass.filter(x=> x.toLowerCase()==="druido").length.toString(),"Druido"))
  }
  
  elaborateColorAndLabels()
  {
    var array = new Array<ColorLabels>();
    const data=this.data.filter(x=> x.x!='0').map(x=> x.y);
    data.forEach(element=>{
      switch(element?.toLowerCase())
      {
        case "prima linea": array.push(new ColorLabels("Prima Linea","rgb(144, 0, 0)"));break;
        case "mago": array.push(new ColorLabels("Mago",'rgb(6, 0, 102)'));break;
        case "ranger": array.push(new ColorLabels("Ranger",'rgb(6, 84, 19)'));break;
        case "bardo": array.push(new ColorLabels("Bardo",'rgb(250, 135, 3)'));break;
        case "chierico": array.push(new ColorLabels("Chierico",'rgb(215, 238, 235)'));break;
        case "rogue": array.push(new ColorLabels("Rogue",'rgb(56, 63, 62)'));break;
        case "druido": array.push(new ColorLabels("Druido",'rgb(16, 155, 137)'));break;
      }
    })
    return array;
  }
}

export class ValoriGraficoDonuts
{
  x?:string;
  y?:string;
  constructor(x:string, y:string) {
    this.x=x;
    this.y=y;
  }
}


export class ColorLabels
{
  color?:string;
  label?:string;
  constructor(label:string, color:string) {
    this.color=color;
    this.label=label;
  }
}