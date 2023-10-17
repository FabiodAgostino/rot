import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip} from 'chart.js' 
import { Statistiche } from 'src/app/models/Statistiche';
import { Interaction } from 'chart.js';
import { Utils } from 'src/app/utils/utility';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip);
var index;
@Component({
  selector: 'app-statistiche-line-chart',
  templateUrl: './statistiche-line-chart.component.html',
  styleUrls: ['./statistiche-line-chart.component.css']
})
export class StatisticheLineChartComponent implements AfterViewInit{

  handlePointClick(clickedElement:any) {
    const guid=clickedElement.element.$context.raw.guid;
    if(guid)
    {
      const item=this.items?.filter(x=> x.guid==guid)[0];
      this.openModal.emit(item);
    }
  }
  @Output() openModal = new EventEmitter<Statistiche>();
  valoriGrafico = new Array<ValoriGrafico>();
  @Input() filtro?: string;
  @Input() items?: Array<Statistiche>;
  indexNumber?:number;

  ngOnChanges(changes: SimpleChanges): void {
    this.changeValoriFiltro();
    this.createChart();
  }
  constructor(public utils:Utils) {
  }
  ngAfterViewInit() {

  }

  
  public chart:any;
  public show: boolean = true;
  createChart(){

    if(this.chart)
    {
      this.chart.destroy();
    }

    this.chart = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart
      data: {// values on X-Axis
	       datasets: [
          {
            label: this.filtro,
            data:this.valoriGrafico,
            backgroundColor: 'blue',

          }
        ]
      },
      options: {
        plugins: {
          tooltip: {
            enabled:true
          }
        },
        aspectRatio:2.5,
        scales: {
          y: {
            suggestedMin: 0 
          }
        },onClick: (event, chartElements) => {
          if (chartElements.length > 0) {
            const clickedElement = chartElements[0];
            // Richiama la funzione al di fuori del costruttore
            this.handlePointClick(clickedElement);
          }
        }
      },
    });
    if(this.valoriGrafico?.map(valore=> valore.y)?.every(x=> x==0))
    {
      this.chart.destroy();
      return;
    }
  }

  changeValoriFiltro()
  {
    switch(this.filtro)
    {
      case "Fama": this.valoriGrafico = this.items!.map(statistica => {
        return new ValoriGrafico(statistica.fama!, new Date(statistica.date), statistica.guid);
      }); break;
      case "Monete": this.valoriGrafico = this.items!.map(statistica => {
        return new ValoriGrafico(statistica.monete!, new Date(statistica.date), statistica.guid);
      }); break;
      case "Nuclei": this.valoriGrafico =this.items!.map(statistica => {
        return new ValoriGrafico(statistica.nuclei!, new Date(statistica.date), statistica.guid);
      }); break;
      case "Sangue": this.valoriGrafico = this.items!.map(statistica => {
        return new ValoriGrafico(statistica.sangue!, new Date(statistica.date), statistica.guid);
      }); break;
      case "Frammenti": this.valoriGrafico = this.items!.map(statistica => {
        return new ValoriGrafico(statistica.frammenti!, new Date(statistica.date), statistica.guid);
      }); break;
      case "Tempo": this.valoriGrafico = this.items!.map(statistica => {
        const minuti = statistica.tempo?.hours!*60+statistica.tempo?.minutes!;
        return new ValoriGrafico(minuti!, new Date(statistica.date), statistica.guid);
      }); break;
    }
  }
}

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

