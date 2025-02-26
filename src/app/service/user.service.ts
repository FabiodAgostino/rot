import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { BehaviorSubject, forkJoin, last, map, Observable, Subject, timestamp } from 'rxjs';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Ticket } from '../models/Tickets';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FullServerDiscord, FullUserDiscord, GuildDiscord, RuoloDiscord, RuoloTipoRuolo, ServerDiscord, TokenDiscord, UserDiscord, UserMeDiscord } from '../models/discord';
import { Utils } from '../utils/utility';
import { switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { LookupServersComponent } from '../home/lookup-servers/lookup-servers.component';
import { environment } from 'src/environments/environment';

const API_ENDPOINT = 'https://discord.com/api/v10';

@Injectable({
  providedIn: 'root'
})



export class UserService {

  constructor(private store: AngularFirestore, private _snackBar:MatSnackBar, private activated:ActivatedRoute, private http:HttpClient, private utils:Utils, private route:Router, private matDialog:MatDialog) {

    const config = require("../../environments/version.json");
    this.develop=config.develop;
    if(this.develop)
    {
      this.redirectUrl=environment.discordConfigLocal.redirectUrl;
      this.clientId=environment.discordConfigLocal.clientId;
      this.clientSecret=environment.discordConfigLocal.clientSecret;
    }
    else
    {
      this.redirectUrl=environment.discordConfig.redirectUrl;
      this.clientId=environment.discordConfig.clientId;
      this.clientSecret=environment.discordConfig.clientSecret;
    }
    this.guildIdRotiniel = environment.discordConfig.guildId;
   }

  guildIdRotiniel: string = '';
  isRotinrim: boolean = false;
  isValidatore: boolean = false;
  userLoggato?: FullUserDiscord;
  develop: boolean=false;
  redirectUrl: string='';
  clientId:string='';
  clientSecret:string=''


  private loggedIn = new BehaviorSubject<boolean>(false);
  private validatoreIn = new BehaviorSubject<boolean>(false);

  private regnanteIn = new BehaviorSubject<boolean>(false);

  get isValidatoreInObs() {
    return this.validatoreIn.asObservable();
  }
  get isLoggedInObs() {
    return this.loggedIn.asObservable();
  }

  get isRegnanteInObs() {
    return this.regnanteIn.asObservable();
  }





  getGuilds(accessToken: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
    return this.http.get<Array<GuildDiscord>>(`${API_ENDPOINT}/users/@me/guilds`, { headers });
  }

  getUserGuildInfo(accessToken: string)
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
    return this.http.get<UserDiscord>(`${API_ENDPOINT}/users/@me/guilds/${this.guildIdRotiniel}/member`, { headers });
  }

  getUserGuildInfoById(accessToken: string, idGuild:string)
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
    return this.http.get<UserDiscord>(`${API_ENDPOINT}/users/@me/guilds/${idGuild}/member`, { headers });
  }

  getUserInfo(accessToken: string)
  {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
    return this.http.get<UserMeDiscord>(`${API_ENDPOINT}/users/@me`, { headers });
  }

  getGuildRoles(guildId: string, accessToken: string)
   {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
    return this.http.get<RuoloDiscord>(`${API_ENDPOINT}/guilds/${guildId}/roles`, { headers });
  }

  getServersDiscord() {
    return this.store.collection<ServerDiscord>('ServerDiscord').valueChanges().pipe(
      switchMap(servers => {
        return this.store.collection<RuoloTipoRuolo>('RuoloTipoRuolo').valueChanges().pipe(
          map(ruoliTipoRuolo => {
            const risultatoUnione = servers.map(server => {
              const ruoli = ruoliTipoRuolo.filter(ruolo => ruolo.guildId === server.id);
              return new FullServerDiscord(ruoli, server.id, server.name, server.date);
            });
            return risultatoUnione;
          })
        );
      })
    );
  }

  private logicaLogin(token: TokenDiscord)
  {
    //qui avrai sicuramente problemi perché non stai considerando che un utente può essere presente in diversi server con ruolo mappato. Sarebbe il caso di fare una modale per scegliere il server
    var subject = new Subject<FullUserDiscord>();
    this.getGuilds(token.access_token).subscribe(guilds=> {
      const res=this.getServersDiscord().subscribe(servers=> { 
        res.unsubscribe();
        servers = servers.filter(x=> guilds.map(x=> x.id).includes(x.id!));

        if(!servers || servers.length==0)
        {
          this.openSnackBar("loginFallita",undefined,undefined,"Non sei presente in alcun server con ROTBOT integrato.");
          return;
        }
        
        let server = servers[0];
        if(servers.length>1)
        {
          const dialogRef=this.matDialog.open(LookupServersComponent,{
            data:servers
          })
          dialogRef.afterClosed().subscribe((serv:FullServerDiscord)=>{
            this.getUserGuildInfoById(token.access_token, serv.id!).subscribe( (user) =>{
              if(user.roles==undefined || user.roles.length==0)
              {
                  this.openSnackBar("loginFallita",undefined,undefined,"Non hai un ruolo adeguato sul server "+serv.name+" per poter effettuare la login.");
                  return;
              }
              if(!this.checkLogin(user, serv))
                  return;

              const username = user.user.global_name==undefined ? user.user.username : user.user.global_name;
              const isValidatore= serv.ruoli?.some(x=> x.isValidatore && x.username==username);
              console.log(isValidatore)
              const ruoli = serv.ruoli?.filter(x=> user.roles.includes(x.idRole!)).map(x=> x.role);

              const fullUser= this.okLogin(user, serv.id!,serv.name!,token,ruoli,isValidatore);
              subject.next(fullUser);
              });
          })
        }
        else
        {
          this.getUserGuildInfoById(token.access_token, server.id!).subscribe( (user) =>{
            if(user.roles==undefined || user.roles.length==0)
            {
                this.openSnackBar("loginFallita",undefined,undefined,"Non hai un ruolo adeguato sul server "+server.name+" per poter effettuare la login.");
                return;
            }
            if(!this.checkLogin(user, server))
                return;

            const username = user.user.global_name==undefined ? user.user.username : user.user.global_name;
            const isValidatore= server.ruoli?.some(x=> x.isValidatore && x.username==username);
  
            const ruoli = server.ruoli?.filter(x=> user.roles.includes(x.idRole!)).map(x=> x.role);
            const fullUser= this.okLogin(user, server.id!,server.name!,token,ruoli,isValidatore);
            subject.next(fullUser);
            });
        }
        
        });
    })
    return subject.asObservable();
  }

  private checkLogin(user:UserDiscord, server:FullServerDiscord)
  {
    const roles = server.ruoli?.filter(x=> user.roles.includes(x.idRole!));
    if(!user || roles?.length==0)
    {
      this.openSnackBar("loginFallita",undefined,undefined,"Non hai un ruolo adeguato sul server "+server.name+" per poter effettuare la login.");
      return false;
    }
    return true;
  }

  

  okLogin(user?: UserDiscord, guildId?:string, guildName?:string, token?:TokenDiscord, ruoli?:any, isValidatore?:boolean)
  {
    const u= new FullUserDiscord(user, guildId, guildName,token,ruoli, isValidatore);
    this.checkUser(u).subscribe();

    this.openSnackBar("login");

    this.loggedIn.next(true);
    localStorage.setItem("idUser",u.id!);
    if(u.ruoli?.includes('Novizi e Cittadini') || u.ruoli?.includes('Valinrim') || u.ruoli?.includes('Ceorita') || u.ruoli?.includes('Senatore'))
    { 
      this.isRotinrim=true;
      u.interno=true;
    }
    if(u.ruoli?.includes('Regnante') || u.ruoli?.includes('Senatore'))
    {
      this.regnanteIn.next(true);
    }
    if(isValidatore)
    {
      this.validatoreIn.next(true);
      this.isValidatore=true;
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
      params.append('client_id', this.clientId);
      params.append('client_secret', this.clientSecret);
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('redirect_uri', this.redirectUrl);

    this.http.post<TokenDiscord>(`${API_ENDPOINT}/oauth2/token`,params, {headers:headers}).subscribe(token=>{
      token.expires = this.utils.addMillisecondsToCurrentDate(token.expires_in);
      subject.next(token);
    })
    return subject.asObservable();
  }



  rekoveAccessToken(token: string)
  {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' }

    let params = new URLSearchParams();
      params.append('client_id', this.clientId);
      params.append('client_secret', this.clientSecret);
      params.append('redirect_uri', this.redirectUrl);
      params.append('token', token);

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
          lastExpiresToken:user.token!.expires,
          ruoli: user.ruoli,
          roles: user.ruoli,
          guildId: user.guildId,
          guildName: user.guildName,
          isValidatore: user.isValidatore
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

  updateUser(user: FullUserDiscord, revoke:boolean=false)
  {
    var subject = new Subject<boolean>();
    var sub=this.store.collection('User',ref=> ref.where("username","==",user.username)).valueChanges({idField: 'id'})
    .subscribe(x=>{
      if(x.length>0)
      {
        if(revoke)
        {
          this.store.collection('User').doc(`${x[0].id}`).set({
            revokeToken: Date.now()
          },
          {
            merge:true
          });

          this.rekoveAccessToken(user.token?.access_token!);
        }
        this.store.collection('User').doc(`${x[0].id}`).set({
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
      ruoli: user.ruoli,
      lastExpiresToken: user.token!.expires,
      id: user.id,
      serverAutenticazione: user.serverAutenticazione,
      registratoDate: new Date,
      guildId: user.guildId,
      guildName: user.guildName,
      isValidatore: user.isValidatore
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
          x[0].registratoDate  = new Date(x[0].registratoDate.seconds * 1000);
          subject.next(x[0]);
          sub.unsubscribe();
        }
      });
    return subject.asObservable();
  }

  getUsers()
  {
    var subject = new Subject<Array<FullUserDiscord>>();

    var sub=this.store.collection<FullUserDiscord>('User').valueChanges()
      .subscribe(x=>{
        if(x.length>0)
        {
          x = x.map(y=>{
            return {...y, registratoDate: this.utils.getFromTimeStamp(y.registratoDate)}
          });
          subject.next(x);
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
      corretto: false,
      data: new Date(),
      id: crypto.randomUUID()
  });
    this.openSnackBar("segnalazioneInviata");
  }

  getTickets()
  {
    var subject = new Subject<Array<Ticket>>();

    var sub=this.store.collection<Ticket>('Ticket').valueChanges()
      .subscribe(x=>{
        if(x.length>0)
        {
          x = x.map(y=>{
            return {...y, data: this.utils.getFromTimeStamp(y.data)}
          });
          subject.next(x);
          sub.unsubscribe();
        }
      });
    return subject.asObservable();
  }

  updateTickets(ticket:Ticket)
  {
    var subject = new Subject<boolean>();
    var sub=this.store.collection('Ticket',ref=> ref.where("id","==",ticket.id)).valueChanges({idField: 'id'})
    .subscribe(x=>{
      if(x.length>0)
      {
        this.store.collection('Ticket').doc(`${x[0].id}`).set({
          corretto: ticket.corretto
        },
        {
          merge:true
        });

      }
    sub.unsubscribe();
    });
    return subject.asObservable();
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
          if(this.userLoggato.ruoli?.includes('Novizi e Cittadini') || this.userLoggato.ruoli?.includes('Valinrim') || this.userLoggato.ruoli?.includes('Ceorita')
          || this.userLoggato.ruoli?.includes('Senatore'))
            this.isRotinrim=true;

          if((this.userLoggato.ruoli?.includes("Regnante") ||this.userLoggato.ruoli?.includes("Senatore") ) )
            this.regnanteIn.next(true);

          if(this.userLoggato.isValidatore)
          {
            this.isValidatore=true;
            this.validatoreIn.next(true);
          }

          x.registratoDate  = new Date(x.registratoDate.seconds * 1000);
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
    this.isValidatore=false;
    this.loggedIn.next(false)
    this.regnanteIn.next(false)
    this.validatoreIn.next(false);
    this.userLoggato=undefined;
    localStorage.removeItem("token");
    localStorage.removeItem("idUser");
    this.utils.navigateOutAdmin();
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
        this.openSnack(text=='' ? "Per poter accedere aver mappato correttamente il tuo server con ROTBOT." : text,"red-snackbar",verticalPosition,horizontalPosition);
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
      panelClass: colorSnack
    });
  }

  




}


