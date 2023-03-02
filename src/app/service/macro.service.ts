import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
}
