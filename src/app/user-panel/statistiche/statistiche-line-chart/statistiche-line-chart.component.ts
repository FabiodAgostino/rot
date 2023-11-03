import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip} from 'chart.js' 
import { FullStatistica, Statistiche } from 'src/app/models/Statistiche';
import { Interaction } from 'chart.js';
import { Utils } from 'src/app/utils/utility';
import { ValoriGrafico } from 'src/app/models/grafici';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip);
var index;
@Component({
  selector: 'app-statistiche-line-chart',
  templateUrl: './statistiche-line-chart.component.html',
  styleUrls: ['./statistiche-line-chart.component.css']
})
export class StatisticheLineChartComponent implements AfterViewInit{
  allEmoji = ["⬆️ ","🪙 ","❄️ ","⚗️ ","🗡️ ","🕙 ","⚔️ "]


  handlePointClick(clickedElement:any) {
    var guid = new Array<string>();
    var statistiche = new Array<Statistiche>();

    if(clickedElement.length==1)
    {
      guid.push(clickedElement[0].element.$context.raw.guid);
      if(guid)
      {
        const item=this.items?.filter(x=> x.guid==guid[0])[0];
        statistiche.push(item!);
      }
    }
    else
    {
      clickedElement.forEach((x: any) => {
        guid.push(x.element.$context.raw.guid);
      });
      if(guid)
      {
        const item = this.items?.filter(x=> guid.includes(x.guid!));
        statistiche=item!;
      }
    }
    this.openModal.emit(statistiche);
  }
  @Output() openModal = new EventEmitter<Array<Statistiche>>();
  valoriGrafico = new Array<ValoriGrafico>();
  @Input() filtro?: string;
  @Input() items?: Array<Statistiche>;
  indexNumber?:number;
  public chart:any;
  public show: boolean = true;

  ngOnChanges(changes: SimpleChanges): void {
    this.changeValoriFiltro();
    this.createChart();
  }
  constructor(public utils:Utils) {
  }
  ngAfterViewInit() {
  }

  

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
            label: this.rimuoviEmoji(this.filtro!,this.allEmoji),
            data:this.valoriGrafico,
            backgroundColor: 'blue',

          }
        ]
      },
      options: {
        plugins: {
          tooltip: {
            enabled:true
          },
          legend:
          {
            display:false
          }
        },
        aspectRatio:2.5,
        scales: {
          y: {
            suggestedMin: 0 
          }
        },onClick: (event, chartElements) => {
          if (chartElements.length > 0) {
            this.handlePointClick(chartElements);
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
    const filtro = this.rimuoviEmoji(this.filtro!,this.allEmoji)
    switch(filtro)
    {
      case "Fama": this.valoriGrafico = this.items!.map(statistica => {
        return new ValoriGrafico(statistica.fama!, new Date(statistica.date), statistica.guid);
      }); break;
      case "Monete": this.valoriGrafico = this.items!.map(statistica => {
        return new ValoriGrafico(statistica.monete!, new Date(statistica.date), statistica.guid);
      }); break;
      case "Armi 4/5": this.valoriGrafico =this.items!.map(statistica => {
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
      case "Numero utenti": this.valoriGrafico = this.items!.map(statistica => {
        return new ValoriGrafico(statistica.userList?.length!, new Date(statistica.date), statistica.guid);
      }); break;
    }
  }

   rimuoviEmoji(stringa:string, listaDiEmoji:any) {
    listaDiEmoji.forEach((emoji: string | RegExp) => {
      const emojiRegex = new RegExp(emoji, 'g');
      stringa = stringa.replace(emojiRegex, '');
    });
    return stringa;
  }
}



