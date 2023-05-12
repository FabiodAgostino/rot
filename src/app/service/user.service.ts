import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { BehaviorSubject, last, map, Observable, Subject, timestamp } from 'rxjs';
import { SessioneAttiva, User } from '../models/User';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Ticket } from '../models/Tickets';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FullUserDiscord, GuildDiscord, TokenDiscord, UserDiscord, UserMeDiscord } from '../models/discord';



const REDIRECT_URL='https://fabiodagostino.github.io/rot/';
const CLIENT_ID='1106594210242625579';
const CLIENT_SECRET ='74VfRYTw1f-ERkI4rfJGSVGwP3ShCsNe';
const API_ENDPOINT = 'https://discord.com/api/v10';
const GUILD_ID_ROTINIEL="511856322141093904";

const leoni="511856322141093904"
@Injectable({
  providedIn: 'root'
})



export class UserService {

  constructor(private store: AngularFirestore, private _snackBar:MatSnackBar, private auth2: AngularFireAuth, private route: Router, private activated:ActivatedRoute, private http:HttpClient) {
   }
  isLoggedIn: boolean = false;
  isRotinrim: boolean = false;
  discordOAuth2: any;



  getGuilds(accessToken: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
    return this.http.get<Array<GuildDiscord>>(`${API_ENDPOINT}/users/@me/guilds`, { headers });
  }

  getUserGuildInfo(accessToken: string)
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
    return this.http.get<UserDiscord>(`${API_ENDPOINT}/users/@me/guilds/${GUILD_ID_ROTINIEL}/member`, { headers });
  }

  getUserInfo(accessToken: string)
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
    return this.http.get<UserMeDiscord>(`${API_ENDPOINT}/users/@me`, { headers });
  }

  private logicaLogin(token: string)
  {
    var subject = new Subject<FullUserDiscord>();
    this.getGuilds(token).subscribe(guilds=> {
      if(guilds.find(guild=> guild.id.includes('511856322141093904'))) //ROTINIEL
      {
        this.getUserGuildInfo(token).subscribe( (u) =>{
          this.openSnackBar("login");
          this.isLoggedIn=true;
          var user=new FullUserDiscord(u);
          if(user.ruoli?.includes('Cittadino'))
            this.isRotinrim=true;
          subject.next(user);
        })
      }
      else if(guilds.find(guild=> guild.id.includes('608322373057249290'))) //THE MIRACLE
      {
        this.getUserInfo(token).subscribe(user=>
          {
            this.openSnackBar("login");
            this.isLoggedIn=true;
            subject.next(new FullUserDiscord(undefined, user.id, user.username));
          })
      }
      else
      {
        this.openSnackBar("loginFallita");
      }
    })
    return subject.asObservable();
  }

  public loginDiscord(code:string)
  {
    var subject = new Subject<FullUserDiscord>();
    this.getAccessToken(code).subscribe(token=>{
      this.logicaLogin(token).subscribe(user=>{
        subject.next(user);
      })
    })
    return subject.asObservable();
  }


  private getAccessToken(code: string)
  {
    var subject = new Subject<string>();
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' }

    let params = new URLSearchParams();
      params.append('client_id', CLIENT_ID);
      params.append('client_secret', CLIENT_SECRET);
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('redirect_uri', REDIRECT_URL);

    this.http.post<TokenDiscord>(`${API_ENDPOINT}/oauth2/token`,params, {headers:headers}).subscribe(token=>{
    localStorage.setItem("token", token.access_token);
      subject.next(token.access_token);
    })
    return subject.asObservable();
  }

  private rekoveAccessToken()
  {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' }

    let params = new URLSearchParams();
      params.append('client_id', CLIENT_ID);
      params.append('client_secret', CLIENT_SECRET);
      params.append('redirect_uri', REDIRECT_URL);
      params.append('token', localStorage.getItem("token")!);

    if(localStorage.getItem("token"))
    this.http.post(`${API_ENDPOINT}/oauth2/token/revoke`,params, {headers:headers}).subscribe(token=>{
    })
  }

  getQueryParams()
  {
    return this.activated.snapshot.queryParamMap.get('code');
  }



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
    localStorage.removeItem("token");
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

      case "loginFallita":
        this.openSnack(text=='' ? "Per poter accedere devi essere presente nel server di Rotiniel o di The Miracle" : text,"red-snackbar",verticalPosition,horizontalPosition);
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


