import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { BehaviorSubject, last, map, Observable, Subject, timestamp } from 'rxjs';
import { SessioneAttiva, User } from '../models/User';
import { FieldValue, serverTimestamp, Timestamp } from "firebase/firestore";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private store: AngularFirestore, private _snackBar:MatSnackBar) { }
  isLoggedIn: boolean = false;

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
          console.log(this.isLoggedIn)
          subject.next(true);
          this.openSnackBar("login");
        }
        else
          this.isLoggedIn=false;
        subject.next(false);
      });
      return subject.asObservable();
  }

  registrati(user: User)
  {
    this.store.collection("User").add({
      username: this.criptMd5(user.username),
      password: this.criptMd5(user.password)
  });
  }

  logout()
  {
    this.logoutPartial();
    this.openSnackBar("logout");
  }

  logoutPartial()
  {
    this.isLoggedIn=false;
    localStorage.removeItem("user");
  }

  checkSession()
  {
    var subject = new Subject<boolean>();
    var user=localStorage.getItem("user")?.toString();
    console.log("check session...");
    if(user!==undefined)
    {
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
                  this.isLoggedIn = true;
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



  openSnackBar(type: string,verticalPosition: MatSnackBarVerticalPosition = 'top', horizontalPosition: MatSnackBarHorizontalPosition = 'end') {

    if(type=="login")
      this._snackBar.open("Sei loggato correttamente!", 'Ok', {
        duration: 2000,
        horizontalPosition: horizontalPosition,
        verticalPosition: verticalPosition,
        panelClass: ['blue-snackbar'],
      });

    if(type=="logout")
      this._snackBar.open("Sei sloggato correttamente!", 'Ok', {
        duration: 2000,
        horizontalPosition: horizontalPosition,
        verticalPosition: verticalPosition,
        panelClass: ['red-snackbar'],
      });
  }

}
