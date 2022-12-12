import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import {  interval, Subject } from 'rxjs';
import { LoginComponent } from '../login/login.component';
import { Classe } from '../models/Pg';
import { User } from '../models/User';
import { SchedaPersonaggioService } from '../service/scheda-personaggio.service';
import { UserService } from '../service/user.service';


@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  constructor(public service: SchedaPersonaggioService, public UserService: UserService, public dialog: MatDialog){}
  iFrameEmitter: Subject<string> = new Subject<string>();
  boolHome= false;
  class = new Array<Classe>();
  develop= false;
   ngOnInit() {
    const config = require("../../environments/version.json");
    this.develop=config.develop;
  }

  goChild(url: string)
  {
    this.boolHome=true;
    setTimeout(()=> {
      this.iFrameEmitter.next(url);}, 100);

  }

  openLogin()
  {
    this.dialog.open(LoginComponent);
  }

  isLoggedIn()
  {
    return this.UserService.isLoggedIn;
  }

  logOut()
  {
    this.UserService.logout();
  }

}




