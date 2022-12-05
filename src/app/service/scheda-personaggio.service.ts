import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Classe, Razza, Religione, Skill, TipologiaSkill } from '../models/Pg';

@Injectable({
  providedIn: 'root'
})
export class SchedaPersonaggioService {

  constructor(private store: AngularFirestore) { }

  getAllClass()
  {
    return this.getObservable(this.store.collection('Classe'))as Observable<Classe[]>;;
  }

  getAllSkills(tipologia: number = -1)
  {
    if(tipologia===-1)
      return this.getObservableSkill(this.store.collection('Skill',ref => ref.orderBy('idTipologiaSkill')))as Observable<Skill[]>;

    return this.getObservableSkill(this.store.collection('Skill', ref=> ref.where('idTipologiaSkill',"==",tipologia.toString())))as Observable<Skill[]>;
  }

  getAllReligioni(pantheon: string = "")
  {
    if(pantheon==="")
      return this.getObservableReligioni(this.store.collection('Religione'))as Observable<Religione[]>;

    return this.getObservableReligioni(this.store.collection('Religione', ref=> ref.where('pantheon',"==",pantheon)))as Observable<Religione[]>;
  }

  getClasseSkills(classe: string)
  {
      return this.getObservableClasseSkills(this.store.collection('Skill', ref => ref.where('classi', "array-contains", classe))) as Observable<Skill[]>;
  }

  getAllRazze()
  {
    return this.getObservableRazza(this.store.collection('Razza'))as Observable<Razza[]>;;
  }

  getAllTipologieSkill()
  {
    return this.getObservableTipologia(this.store.collection('TipologiaSkill'))as Observable<TipologiaSkill[]>;;
  }

  AddSkill(skill: Skill)
  {
    this.store.collection("Skill").add({
      nome: skill.nome,
      classi: skill.classi,
      idTipologiaSkill: skill.idTipologiaSkill
  });
  }



  private getObservable = (collection: AngularFirestoreCollection<Classe>) => {
    const subject = new BehaviorSubject<Classe[]>([]);
    collection.valueChanges({ idField: 'id' }).subscribe((val: Classe[]) => {
      subject.next(val);
    });
    return subject;
  };

  private getObservableSkill = (collection: AngularFirestoreCollection<Skill>) => {
    const subject = new BehaviorSubject<Skill[]>([]);
    collection.valueChanges({ idField: 'id' }).subscribe((val: Skill[]) => {
      subject.next(val);
    });
    return subject;
  }

  private getObservableTipologia = (collection: AngularFirestoreCollection<TipologiaSkill>) => {
    const subject = new BehaviorSubject<TipologiaSkill[]>([]);
    collection.valueChanges({ idField: 'id' }).subscribe((val: TipologiaSkill[]) => {
      subject.next(val);
    });
    return subject;
  }

  private getObservableRazza = (collection: AngularFirestoreCollection<Razza>) => {
    const subject = new BehaviorSubject<Razza[]>([]);
    collection.valueChanges({ idField: 'id' }).subscribe((val: Razza[]) => {
      subject.next(val);
    });
    return subject;
  }

  private getObservableClasseSkills = (collection: AngularFirestoreCollection<Skill>) => {
    const subject = new BehaviorSubject<Skill[]>([]);
    collection.valueChanges({ idField: 'id' }).subscribe((val: Skill[]) => {
      subject.next(val);
    });
    return subject;
  }

  private getObservableReligioni = (collection: AngularFirestoreCollection<Religione>) => {
    const subject = new BehaviorSubject<Religione[]>([]);
    collection.valueChanges({ idField: 'id' }).subscribe((val: Religione[]) => {
      subject.next(val);
    });
    return subject;
  }

}
