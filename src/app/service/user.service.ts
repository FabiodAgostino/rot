import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { BehaviorSubject, last, Observable, Subject, timestamp } from 'rxjs';
import { SessioneAttiva, User } from '../models/User';
import { FieldValue, serverTimestamp, Timestamp } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private store: AngularFirestore) { }
  isLoggedIn: boolean = false
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
          subject.next(true);
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
    this.isLoggedIn=false;
    localStorage.removeItem("user");
  }

  checkSession()
  {
    var subject = new Subject<boolean>();
    var user=localStorage.getItem("user")?.toString();
    if(user!==undefined)
      this.isLoggedIn=true;
    console.log("check session...");
    if(user!==undefined)
    {
      let date = new Date();
      var dateminute = new Date(date.getTime() - 10*60000);
      (this.getObservableSessione(this.store.collection('SessioneAttiva',ref=> ref.where("data",">=",dateminute))) as Observable<SessioneAttiva[]>).subscribe
      (x=>{
        if(x.length>0)
        {
          var sessioneAttiva=x.filter(x=> x.username===user);
          if(sessioneAttiva.length>0)
            this.isLoggedIn = true;
          else
            this.isLoggedIn = false;
        }
        else
        {
          this.isLoggedIn=false;
          this.logout();
        }
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


  private getObservableSessione = (collection: AngularFirestoreCollection<SessioneAttiva>) => {
    const subject = new BehaviorSubject<SessioneAttiva[]>([]);
    collection.valueChanges({ idField: 'id' }).subscribe((val: SessioneAttiva[]) => {
      subject.next(val);
    });
    return subject;
  };

  private criptMd5(value: string)
  {
    var md5 = require('md5');
    return md5(value);
  }


}
