import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Timestamp } from 'firebase/firestore';
import { BehaviorSubject, last, map, Observable, Subject, timestamp } from 'rxjs';
import { Macro, MacroFirebase, MacroFull, MacroSettings, MacroSettingsFront, MacroToInsert } from '../models/Macro';

const TIPOLOGIA_MACRO: string[] = ["Combattiva","Alza skill","Farming risorse","Generica"];

@Injectable({
  providedIn: 'root'
})
export class MacroService {

  constructor(private store: AngularFirestore) { }


  GetTipologieMacro()
  {
    return TIPOLOGIA_MACRO;
  }

  getMacro(guid: string)
  {
    var response= this.store.collection<MacroFirebase>('MacroUser', ref=> ref.where("guid","==",guid)).valueChanges()
    .pipe(map(collection=>{
        return collection.map(collection=>{
          let dr = new MacroFull();
          dr.macro.author=collection.author;
          dr.macro.guid=collection.guid;
          dr.macro.like=collection.like;
          dr.tipologia=collection.tipologia;
          dr.macro.title=collection.title;
          dr.descrizione=collection.descrizione;
          dr.macro.utenti=collection.utenti;
          return dr;
        })
    }))
    return response;
  }

  getMacroSettingsUser(guid: string)
  {
    var response= this.store.collection<MacroSettingsFront>('MacroSettingsUser', ref=> ref.where("guid","==",guid)).valueChanges()
    .pipe(map(collection=>{
        return collection.map(collection=>{
          let dr = new MacroSettingsFront();
          dr.comando=collection.comando;
          dr.settings=collection.settings;
          dr.type=collection.type;
          dr.function=collection.function;
          dr.index=collection.index;
          return dr;
        })
    }))
    return response;
  }

  getMacros()
  {
    var response= this.store.collection<Macro>('MacroUser').valueChanges()
      .pipe(map(collection=>{
          return collection.map(collection=>{
            let dr = new Macro();
            dr.author=collection.author;
            dr.date=(collection.dateTimeStamp as Timestamp).toDate()
            dr.guid=collection.guid;
            dr.like=collection.like;
            dr.tipologia=collection.tipologia;
            dr.title=collection.title;
            dr.utenti=collection.utenti;
            return dr;
          })
      }))
      return response;
  }

  getMacroSettings()
  {
    var response= this.store.collection<MacroSettings>('MacroSettings').valueChanges()
      .pipe(map(collection=>{
          return collection.map(collection=>{
            let dr = new MacroSettings();
            dr.comando=collection.comando;
            dr.settings=collection.settings;
            dr.type=collection.type;
            return dr;
          })
      }))
      return response;
  }

  addLikeMacro(guid: string, utente: string)
  {
    var subject = new Subject<boolean>();
    var pg=this.store.collection<Macro>('MacroUser', ref=> ref.where('guid','==',guid)).valueChanges({idField: 'id'}).subscribe(x=>{
      if(x!=null && x.length>0 && x[0].author!=utente)
      {
        if(x[0].utenti.includes(utente))
        {
          x[0].utenti=x[0].utenti.filter(u=> u!=utente);
          x[0].like--;
        }
        else
        {
          x[0].utenti.push(utente);
          x[0].like++;
        }
        var up=this.store.collection('MacroUser').doc(`${x[0].id}`).set({
          like: x[0].like,
          utenti: x[0].utenti
        },
        {
          merge:true
        });
        pg.unsubscribe();
        return subject.next(true);
      }
    })
    return subject.asObservable();
  }

  addMacros(macro: MacroToInsert)
  {
      this.store.collection("MacroUser").add({
        author: macro.macro.author,
        title: macro.macro.title,
        dateTimeStamp: macro.macro.date,
        descrizione: macro.descrizione,
        tipologia: macro.macro.tipologia,
        like:0,
        guid: macro.macro.guid,
        utenti: macro.macro.utenti
    });

    macro.settings.forEach(x=>{
      this.store.collection("MacroSettingsUser").add({
        guid:macro.macro.guid,
        comando: x.comando,
        settings: x.settings,
        type: x.type,
        function: x.function,
        index: x.index
      });
    })
  }

  updateMacro(macro: MacroToInsert)
  {

    var pg=this.store.collection('MacroUser', ref=> ref.where('guid','==',macro.macro.guid)).valueChanges({idField: 'id'}).subscribe(x=>{
      if(x!=null && x.length>0)
      {
        var up=this.store.collection('MacroUser').doc(`${x[0].id}`).set({
          title: macro.macro.title,
          descrizione: macro.descrizione,
          tipologia: macro.macro.tipologia,
        },
        {
          merge:true
        });

        const ref=this.store.collection('MacroSettingsUser', ref=> ref.where('guid','==',macro.macro.guid)).valueChanges({idField: 'id'})
          .subscribe(y=>{
            if(y.length>0)
            {
              for(let i=0;i<y.length;i++)
              {
                 this.store.doc('MacroSettingsUser/'+y[i].id).delete();
                 if(i==y.length-1)
                 {
                  macro.settings.forEach(x=>{
                    this.store.collection("MacroSettingsUser").add({
                      guid:macro.macro.guid,
                      comando: x.comando,
                      settings: x.settings,
                      type: x.type,
                      function: x.function,
                      index: x.index
                    });
                  ref.unsubscribe();
                  })
                 }
              }
            }
          });
      }
        pg.unsubscribe();
    }, err=> console.error("Error"));
  }


  deleteMacro(guid: string)
  {
    const ref=this.store.collection('MacroUser', ref=> ref.where('guid','==',guid)).valueChanges({idField: 'id'})
      .subscribe(x=>{
        if(x.length>0)
        {
          this.store.doc('MacroUser/'+x[0].id).delete();
          const ref2=this.store.collection('MacroSettingsUser', ref=> ref.where('guid','==',guid)).valueChanges({idField: 'id'})
            .subscribe(y=>{
            if(y.length>0)
            {
              for(let i=0;i<y.length;i++)
              {
                 this.store.doc('MacroSettingsUser/'+y[i].id).delete();
                 if(i==y.length-1)
                  {
                    ref.unsubscribe();
                    ref2.unsubscribe();
                  }
              }
            }
            })
        }
      })
  }
}
