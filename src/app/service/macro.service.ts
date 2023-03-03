import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
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

  getMacro(id: number)
  {

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
      this.store.collection("Macro").add({
        author: macro.macro.author,
        title: macro.macro.title,
        date: macro.macro.date,
        descrizione: macro.descrizione,
    });
  }
}
