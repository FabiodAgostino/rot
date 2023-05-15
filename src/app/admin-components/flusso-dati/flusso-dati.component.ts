import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/service/user.service';
import { Chart, Utils } from 'src/app/utils/utility';

@Component({
  selector: 'app-flusso-dati',
  templateUrl: './flusso-dati.component.html',
  styleUrls: ['./flusso-dati.component.css']
})
export class FlussoDatiComponent implements OnInit {

  registrationMesiCounts= new Array<number>();
  registrationGiorniCounts= new Array<number>();
  serverCounts= new Array<number>();
  constructor(private userService:UserService)
  {

  }
  monthlyData:any []=[];
  weeklyData:any []=[];
  serverData:any []=[];
  barColors: string[] = ['rgba(0, 74, 159, 0.7)'];
  months: string[] = Chart.getMesi();
  weeks: string[] = Chart.getGiorni();
  server: string[] = ['The Miracle Shard','Rotiniel'];
  chartOptions: any = {
    responsive: true
  };
  chartType: string = 'bar';
  selectedTab: string = 'monthly';
  title: string='';
  changeChartType(type: string): void {
    this.selectedTab = type;

    switch(type)
    {
      case 'monthly': this.chartType='bar'; this.title='Registrazioni Mensili';break;
      case 'days': this.chartType='line'; this.title='Registrazioni Settimanali';break;
      case 'server': this.chartType='pie'; this.title='Autenticazioni Server';break;
    }
  }




  ngOnInit(): void {
    this.getUsersData().subscribe(x=>{
      if(x)
      {
        this.monthlyData = [
          { data:this.registrationMesiCounts, label: 'Mensile', backgroundColor: this.barColors }
        ];
        this.weeklyData = [
          { data: this.registrationGiorniCounts, label: 'Settimanale', backgroundColor: this.barColors }
        ];

        this.serverData = [
          { data: this.serverCounts, label: 'Autenticazioni', backgroundColor: this.barColors }
        ];
      }
    });
  }

  getUsersData()
  {
    var subject = new Subject<boolean>();
    this.userService.getUsers().subscribe(users=>{
      this.registrationMesiCounts=Chart.occorrenzeMesi(users.map(obj => obj.registratoDate.getMonth()));
      this.registrationGiorniCounts=Chart.occorrenzeGiorni(users.map(obj => obj.registratoDate));
      this.serverCounts= Chart.occorrenzeServer(users.map(obj=> obj.serverAutenticazione!));
      subject.next(true)
    })
    return subject.asObservable();
  }










}
