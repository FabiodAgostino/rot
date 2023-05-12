import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  interval, Subject } from 'rxjs';
import { LoginComponent } from '../user/login/login.component';
import { Classe } from '../models/Pg';
import { User } from '../models/User';
import { SchedaPersonaggioService } from '../service/scheda-personaggio.service';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  constructor(public service: SchedaPersonaggioService, public UserService: UserService, public dialog: MatDialog, public router: Router){}
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
    window.location.href='https://discord.com/api/oauth2/authorize?client_id=1106594210242625579&redirect_uri=https%3A%2F%2Ffabiodagostino.github.io%2Frot%2F&response_type=code&scope=identify%20connections%20guilds';
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




