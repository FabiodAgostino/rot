import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Timestamp } from 'firebase/firestore';
import { BehaviorSubject, forkJoin, last, map, Observable, Subject, switchMap, timestamp } from 'rxjs';
import { Macro, MacroFirebase, MacroFull, MacroSettings, MacroSettingsFront, MacroToInsert } from '../models/Macro';
import { Utils } from '../utils/utility';
import { Dungeon, ImmaginiContest, MedieStatistiche, Statistiche, StatisticheImmagini, TempoCaccia } from '../models/Statistiche';
import { ServerDiscord } from '../models/discord';


@Injectable({
  providedIn: 'root'
})
export class StatisticheService {

  constructor(private store:AngularFirestore) { }


  getCacciaOrganizzataTempoLoot(idGuild: string, mese: number, anno: number,annoIntero:boolean=false) {

    let inizioMeseTimestamp=0;
    let fineMeseTimestamp=0;
    if(!annoIntero)
    {
      inizioMeseTimestamp = new Date(anno, mese - 1, 1).getTime();
      fineMeseTimestamp = new Date(anno, mese, 0, 23, 59, 59, 999).getTime();
    }
    else
    {
      mese=1;
      let fineMese=12
      inizioMeseTimestamp = new Date(anno, mese, 1).getTime();
      fineMeseTimestamp = new Date(anno, fineMese, 0, 23, 59, 59, 999).getTime();
    }
   
  
   var response= this.store
      .collection<Statistiche>('CacciaOrganizzataTempoLoot', (ref) =>
        ref
          .where('guildId', '==', idGuild)
          .where('date', '>=', new Date(inizioMeseTimestamp))
          .where('date', '<=', new Date(fineMeseTimestamp))
      )
      .valueChanges()
      .pipe(map(collection=>{
        return collection.map(collection=>{
          let dr = new Statistiche();
          dr.guid = crypto.randomUUID();
          dr.date = (collection.date as Timestamp).toDate();
          dr.date = new Date(dr.date.setMonth(dr.date.getMonth()+1)); 
          var date = (collection.date as Timestamp).toDate();
          dr.dateFinish = date.getDate() + " - "+(date.getMonth()+1)+" - "+date.getFullYear()+" alle "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
          dr.fama=collection.fama;
          dr.guildId= collection.guildId;
          dr.guildName = collection.guildName;
          dr.monete = collection.monete;
          dr.nuclei = collection.nuclei;
          dr.sangue = collection.sangue;
          dr.tempo = collection.tempo;
          dr.userList = collection.userList;
          dr.userRole = collection.userRole;
          dr.destination=collection.destination;
          dr.frammenti = collection.frammenti;
          return dr;
        })
    }));
      return response;
  }


  getMedie(idGuild: string,dungeon:string): Observable<MedieStatistiche> {
    return this.store
      .collection<MedieStatistiche>('CacciaOrganizzataTempoLoot', (ref) =>
        ref
          .where('guildId', '==', idGuild)
          .where('destination', '==', dungeon)
      )
      .valueChanges()
      .pipe(
        map(collection => {
          const medie = new MedieStatistiche();
          if (collection.length > 0) {

          medie.dungeon=dungeon;
          medie.nVolte=collection.length;

          var itemFama=collection.map(x=> x.fama).filter(x=> x>500) as Array<number>;
          if(itemFama.length>0)
            medie.fama = itemFama.reduce((sum, current) => (Number(sum) + Number(current))) / itemFama.length;

          var itemSangue=collection.map(x=> x.sangue).filter(x=> x>10) as Array<number>;
          if(itemSangue.length>0)
            medie.sangue = itemSangue.reduce((sum, current) => (Number(sum) + Number(current))) / itemSangue.length;

          var itemMonete=collection.map(x=> x.monete).filter(x=> x>15000) as Array<number>;
          if(itemMonete.length>0)
            medie.monete = itemMonete.reduce((sum, current) => (Number(sum) + Number(current))) / itemMonete.length;

          var itemFrammenti=collection.map(x=> x.frammenti).filter(x=> x>10) as Array<number>;
          if(itemFrammenti.length>0)
            medie.frammenti = itemFrammenti.reduce((sum, current) => (Number(sum) + Number(current))) / itemFrammenti.length;

          var itemNuclei=collection.map(x=> x.nuclei) as Array<number>;
          medie.nuclei = itemNuclei.reduce((sum, current) => (Number(sum) + Number(current))) / itemNuclei.length;

          let sommaOre = 0;
          let sommaMinuti = 0;
          let sommaSecondi = 0;
          
          collection.forEach(item => {
            sommaOre += item.tempo?.hours || 0;
            sommaMinuti += item.tempo?.minutes || 0;
            sommaSecondi += item.tempo?.seconds || 0;
          });
          const sommaTotaleSecondi = sommaOre * 3600 + sommaMinuti * 60 + sommaSecondi;

          medie.tempo = new TempoCaccia(Math.floor(sommaTotaleSecondi / collection.length / 3600),Math.floor((sommaTotaleSecondi / collection.length % 3600) / 60),sommaTotaleSecondi / collection.length % 60);
          const sommaNumeroPG = collection.reduce((acc, item) => acc + (item.userList ? item.userList.length : 0), 0);
          medie.numeroPg = Math.floor(sommaNumeroPG / collection.map(x=>x.userList).length);
          }
  
          return medie;
        })
      );
  }



  getDungeons() {
   var response= this.store
      .collection<Dungeon>('Dungeon')
      .valueChanges()
      .pipe(map(collection=>{
        return collection.map(collection=>{
          let dr = new Dungeon();
          dr.emoji=collection.emoji;
          dr.name=collection.name;
          return dr;
        })
    }));
      return response;
  }

  getGuilds() {
    var response= this.store
       .collection<ServerDiscord>('ServerDiscord')
       .valueChanges()
       .pipe(map(collection=>{
         return collection.map(collection=>{
           let dr = new ServerDiscord();
           dr.name=collection.name;
           dr.id=collection.id;
           return dr;
         })
     }));
       return response;
   }

  getContest() {
    return this.store.collection<Statistiche>('CacciaOrganizzataTempoLoot').valueChanges().pipe(
      switchMap(cacce => {
        return this.store.collection<ImmaginiContest>('ImmaginiContest').valueChanges().pipe(
          map(immagini => {
            const risultatoUnione = cacce.map(caccia => {
              caccia.date = (caccia.date as Timestamp).toDate();
              const imgs = immagini.filter(img => img?.idCacciaOrganizzataTempoLoot==caccia?.id?.toString())[0];
              return new StatisticheImmagini(caccia, imgs?.images,imgs?.inAttesaDiValidazione, imgs?.validazione);
            });
            return risultatoUnione.filter(x=> x.imgs!=undefined);
          })
        );
      })
    );
  }
  
}
