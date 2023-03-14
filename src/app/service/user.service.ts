import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { BehaviorSubject, last, map, Observable, Subject, timestamp } from 'rxjs';
import { SessioneAttiva, User } from '../models/User';
import { FieldValue, serverTimestamp, Timestamp } from "firebase/firestore";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Ticket } from '../models/Tickets';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private store: AngularFirestore, private _snackBar:MatSnackBar) { }
  isLoggedIn: boolean = false;
  isRotinrim: boolean = false;

  login(user: User)
  {
    var subject = new Subject<boolean>();
    user.username=this.criptMd5(user.username);
    user.password=this.criptMd5(user.password);

    this.store.collection('User',ref=> ref.where("username","==",user.username).where("password","==",user.password)).valueChanges()
      .subscribe(x=>{
        if(x.length>0)
        {
          this.addSession(user);
          localStorage.setItem("user",user.username);
          this.isLoggedIn=true;
          this.Rotinrim();
          subject.next(true);
          this.openSnackBar("login");
        }
        else
          this.logoutPartial();

        subject.next(false);
      });
      return subject.asObservable();
  }

  checkUser(username: string)
  {
    var un= this.criptMd5(username);
    return this.store.collection('User',ref=> ref.where("username","==",un)).valueChanges();
  }

  checkUserMd5(username: string)
  {
      return this.store.collection<User>('User',ref=> ref.where("username","==",username)).valueChanges();
  }

  registrati(user: User)
  {
    this.store.collection("User").add({
      username: this.criptMd5(user.username),
      usernameNoMd5: user.username,
      password: this.criptMd5(user.password),
      nomePg: user.nomePg,
      regno: user.regno,
  });
  }


  Rotinrim()
  {
    var username=localStorage.getItem("user");
    var subject = new Subject<boolean>();

    this.store.collection('User',ref=> ref.where("username","==",username).where("regno","==","Rotiniel")).valueChanges()
      .subscribe(x=>{
        if(x.length>0)
          this.isRotinrim=true;
        else
          this.isRotinrim=false;
      });
  }

  SalvaTicket(ticket: Ticket)
  {
    this.store.collection("Ticket").add({
      user: ticket.user,
      messaggio: ticket.messaggio,
      tipologia: ticket.tipologia,
      tool: ticket.tool,
      data: new Date()
  });
    this.openSnackBar("segnalazioneInviata");
  }

  logout()
  {
    this.logoutPartial();
    this.openSnackBar("logout");
    window.location.reload();
  }

  logoutPartial()
  {
    this.isRotinrim=false;
    this.isLoggedIn=false;
    localStorage.removeItem("user");
  }


  checkSession()
  {
    var user=localStorage.getItem("user")?.toString();
    if(user!==undefined)
    {
      console.log("check session...");
      let date = new Date();
      var dateminute = new Date(date.getTime() - 10*60000);
      var x=this.store.collection<SessioneAttiva>('SessioneAttiva',ref=> ref.where("data",">=",dateminute)).valueChanges()
      .pipe(map(collection => {
        return collection.map(b => {
            let sessione = new SessioneAttiva();
            sessione.username = b.username;
            sessione.data = b.data;
            sessione.id = b.id;
            return sessione;
        });
      }));
      x.subscribe(x=> {
          if(x.length>0)
              {
                var sessioneAttiva=x.filter(x=> x.username===user);
                if(sessioneAttiva.length>0)
                {
                  this.Rotinrim();
                  this.isLoggedIn = true;
                }
                else
                  this.logoutPartial()
              }
          else
            this.logoutPartial();
      });
    }
  }


  addSession(user: User)
  {
      this.store.collection("SessioneAttiva").add({
        username: user.username,
        attiva: true,
        data: new Date()
    });
  }


  private criptMd5(value: string)
  {
    var md5 = require('md5');
    return md5(value);
  }



  openSnackBar(type: string,verticalPosition: MatSnackBarVerticalPosition = 'top', horizontalPosition: MatSnackBarHorizontalPosition = 'end', text='')
  {

    switch(type)
    {
      case "login":
        this.openSnack("Sei loggato correttamente!","blue-snackbar");
        break;

      case "logout":
        this.openSnack("Sei sloggato correttamente!","red-snackbar");
        break;

      case "registrazioneAvvenuta":
        this.openSnack("La registrazione è avvenuta con successo!","green-snackbar");
        break;

      case "registrazioneFallita":
        this.openSnack(text=='' ? "Hai sbagliato una o più risposte!" : text,"red-snackbar",verticalPosition,horizontalPosition);
        break;

      case "segnalazioneInviata":
        this.openSnack("La segnalazione è stata inviata!","green-snackbar");
        break;

      case "infoAggiuntive":
        this.openSnack("Scarica il pdf per avere tutte le info aggiuntive.","green-snackbar", verticalPosition,horizontalPosition);
        break;
    }

  }

  private openSnack(testo: string, colorSnack: string,verticalPosition: MatSnackBarVerticalPosition = 'top', horizontalPosition: MatSnackBarHorizontalPosition = 'end')
  {
    this._snackBar.open(testo, 'Ok', {
      duration: 2000,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      panelClass: colorSnack,
    });
  }

}


