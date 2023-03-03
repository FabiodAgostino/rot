import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Timestamp } from 'firebase/firestore';
import { BehaviorSubject, last, map, Observable, Subject, timestamp } from 'rxjs';
import { Macro, MacroSettings, MacroSettingsFront, MacroToInsert } from '../models/Macro';

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


  addMacros(macro: MacroToInsert)
  {
      this.store.collection("MacroUser").add({
        author: macro.macro.author,
        title: macro.macro.title,
        dateTimeStamp: macro.macro.date,
        descrizione: macro.descrizione,
        tipologia: macro.macro.tipologia,
        like:0,
        guid: macro.macro.guid
    });

    macro.settings.forEach(x=>{
      this.store.collection("MacroSettingsUser").add({
        guid:macro.macro.guid,
        comando: x.comando,
        settings: x.settings,
        type: x.type
      });
    })
  }
}
