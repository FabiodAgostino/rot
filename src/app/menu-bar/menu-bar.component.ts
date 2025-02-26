import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  interval, Subject } from 'rxjs';
import { Classe } from '../models/Pg';
import { SchedaPersonaggioService } from '../service/scheda-personaggio.service';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { Utils } from '../utils/utility';
import {MatMenuModule} from '@angular/material/menu';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  constructor(public service: SchedaPersonaggioService, public UserService: UserService, public dialog: MatDialog, public router: Router, public utils:Utils){}
  iFrameEmitter: Subject<string> = new Subject<string>();
  boolHome= false;
  class = new Array<Classe>();
  develop= false;
  isLoggedIn: boolean=false;
  isRegnante: boolean=false;
  isValidatore: boolean=false;
  isSmartphone: boolean=false;
   ngOnInit() {
    const config = require("../../environments/version.json");
    this.develop=config.develop;
    this.UserService.isLoggedInObs.subscribe(x=>{
      this.isLoggedIn=x;
    });
    this.regnanteIn();
    this.isSmartphone=this.utils.isSmartphone();
  }

  goChild(url: string)
  {
    this.boolHome=true;
    setTimeout(()=> {
      this.iFrameEmitter.next(url);}, 100);

  }

  openLogin()
  {
    localStorage.setItem("lastUrl",this.router.url);
    window.location.href= this.develop ? environment.discordConfigLocal.loginDiscord : environment.discordConfig.loginDiscord;
  }

  logOut()
  {
    this.UserService.logout();
  }

  goAdmin()
  {
    this.router.navigate(['/admin'])
  }

  goStatistiche()
  {
    this.router.navigate(['/statistiche-view'])
  }


  regnanteIn()
  {
    this.UserService.isRegnanteInObs.subscribe(x=>{
      this.isRegnante=x;
    })
  }



}




