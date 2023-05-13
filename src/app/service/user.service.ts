import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { BehaviorSubject, last, map, Observable, Subject, timestamp } from 'rxjs';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Ticket } from '../models/Tickets';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FullUserDiscord, GuildDiscord, TokenDiscord, UserDiscord, UserMeDiscord } from '../models/discord';
import { Utils } from '../utils/utility';


const REDIRECT_URL_LOCALE='http://localhost:4200/';


const REDIRECT_URL='https://fabiodagostino.github.io/rot/';
const CLIENT_ID='1106594210242625579';
const CLIENT_SECRET ='74VfRYTw1f-ERkI4rfJGSVGwP3ShCsNe';
const API_ENDPOINT = 'https://discord.com/api/v10';
const GUILD_ID_ROTINIEL="511856322141093904";

@Injectable({
  providedIn: 'root'
})



export class UserService {

  constructor(private store: AngularFirestore, private _snackBar:MatSnackBar, private activated:ActivatedRoute, private http:HttpClient, private utils:Utils) {

    const config = require("../../environments/version.json");
    this.develop=config.develop;
   }


  isRotinrim: boolean = false;
  userLoggato?: FullUserDiscord;
  develop: boolean=false;

  private loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedInObs() {
    return this.loggedIn.asObservable();
  }





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

  private logicaLogin(token: TokenDiscord)
  {
    var subject = new Subject<FullUserDiscord>();
    this.getGuilds(token.access_token).subscribe(guilds=> {
      if(guilds.find(guild=> guild.id.includes('511856322141093904'))) //ROTINIEL
      {
        this.getUserGuildInfo(token.access_token).subscribe( (u) =>{
          const user= this.okLogin(token, "Rotiniel",u);
          subject.next(user);
        },
        (error)=>
        {
          this.getUserInfo(token.access_token).subscribe(u=>{
            const user= this.okLogin(token, "Rotiniel",undefined, u.id,u.username);
            subject.next(user);
          })
        })
      }
      else if(guilds.find(guild=> guild.id.includes('608322373057249290'))) //THE MIRACLE
      {
        this.getUserInfo(token.access_token).subscribe(u=>
          {
            subject.next(this.okLogin(token, "The Miracle Shard",undefined,u.id,u.username));
          })
      }
      else
      {
        this.openSnackBar("loginFallita");
      }
    })
    return subject.asObservable();
  }

  okLogin( token: TokenDiscord, serverAutenticazione:string, user?: UserDiscord, idUser?: string, username?:string, )
  {
    const u= new FullUserDiscord(token,user, idUser, username);
    u.serverAutenticazione=serverAutenticazione;
    this.checkUser(u).subscribe()
    this.openSnackBar("login");
    this.loggedIn.next(true);
    localStorage.setItem("idUser",u.id!);

    if(u.ruoli?.includes('Cittadino'))
    {
      this.isRotinrim=true;
      u.interno=true;
    }
    return u;
  }

  public loginDiscord(code:string)
  {
    var subject = new Subject<FullUserDiscord>();
    this.getAccessToken(code).subscribe(token=>{
      this.logicaLogin(token).subscribe(user=>{
        this.userLoggato=user;
        this.loggedIn.next(true);
        subject.next(user);
      })
    })
    return subject.asObservable();
  }


  private getAccessToken(code: string)
  {
    var subject = new Subject<TokenDiscord>();
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' }

    let params = new URLSearchParams();
      params.append('client_id', CLIENT_ID);
      params.append('client_secret', CLIENT_SECRET);
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('redirect_uri', this.develop? REDIRECT_URL_LOCALE : REDIRECT_URL);

    this.http.post<TokenDiscord>(`${API_ENDPOINT}/oauth2/token`,params, {headers:headers}).subscribe(token=>{
      token.expires = this.utils.addMillisecondsToCurrentDate(token.expires_in);
      subject.next(token);
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



  checkUser(user: FullUserDiscord)
  {
    var subject = new Subject<boolean>();
    var sub=this.store.collection('User',ref=> ref.where("username","==",user.username)).valueChanges({idField: 'id'})
    .subscribe(x=>{
      if(x.length>0)
      {
        this.store.collection('User').doc(`${x[0].id}`).set({
          lastExpiresToken:user.token.expires,
          ruoli: user.ruoli
        },
        {
          merge:true
        });
      }
      else
        this.registrati(user);
    sub.unsubscribe();
    });
    return subject.asObservable();
  }

  registrati(user: FullUserDiscord)
  {
    this.store.collection("User").add({
      username: user.username,
      roles: user.ruoli,
      lastExpiresToken: user.token.expires,
      id: user.id,
      serverAutenticazione: user.serverAutenticazione
  });
  }


  getUser()
  {
    const idUser=localStorage.getItem("idUser");
    var subject = new Subject<FullUserDiscord>();

    var sub=this.store.collection<FullUserDiscord>('User',ref=> ref.where("id","==",idUser)).valueChanges()
      .subscribe(x=>{
        if(x.length==1)
        {
          subject.next(x[0]);
          sub.unsubscribe();
        }
      });
    return subject.asObservable();
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

  isLogged()
  {
    var subject = new Subject<boolean>();
    const idUser= localStorage.getItem("idUser");
    if(idUser)
    {
      this.getUser().subscribe(x=>{
        if(x)
        {
          if(this.utils.compareDates(x.lastExpiresToken))
          {
            this.logoutPartial();
            this.openSnackBar("sessioneScaduta");
            return;
          }
          this.userLoggato=x;
          this.loggedIn.next(true)
          if(this.userLoggato.ruoli?.includes('Cittadino'))
            this.isRotinrim=true;
        }
        else
          this.logoutPartial();

        subject.next(true);
      })
    }
    return subject.asObservable();
  }


  logout()
  {
    this.logoutPartial();
    this.openSnackBar("logout");
  }

  logoutPartial()
  {
    this.isRotinrim=false;
    this.loggedIn.next(false)
    this.userLoggato=undefined;
    localStorage.removeItem("token");
    localStorage.removeItem("idUser");
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

      case "sessioneScaduta":
        this.openSnack("Sessione scaduta, effettua di nuovo la login!","yellow-snackbar", verticalPosition,horizontalPosition);
        break;

      case "effettuaLogin":
        this.openSnack("Per poter inviare un ticket effettua la login!","yellow-snackbar", verticalPosition,horizontalPosition);
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


