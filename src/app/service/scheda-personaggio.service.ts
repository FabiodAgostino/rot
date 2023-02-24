import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Classe, DomandaRisposta, InfoSkill, PartialPg, Pg, Razza, Regno, Religione, Skill, SkillChecked, SkillsPg, SpellChierico, SpellPaladino, TipologiaSkill } from '../models/Pg';

@Injectable({
  providedIn: 'root'
})
export class SchedaPersonaggioService {

  constructor(private store: AngularFirestore, private angularFire : AngularFireDatabase) { }

  getAllClass()
  {
    return this.getObservable(this.store.collection('Classe'))as Observable<Classe[]>;;
  }

  getSpellPaladinoFromDivinita(divinita: string)
  {
    var response= this.store.collection<SpellPaladino>('SpellPaladino', ref => ref.where('religione',"==",divinita)).valueChanges()
      .pipe(map(collection=>{
          return collection.map(collection=>{
            let spell = new SpellPaladino();
            spell.aura=collection.aura;
            spell.religione=collection.religione;
            spell.id=collection.id;
            spell.spell=collection.spell;
            return spell;
          })
      }))
      return response;
  }

  getSpellChiericoFromDivinita(divinita: string)
  {
    var response= this.store.collection<SpellChierico>('SpellChierico', ref => ref.where('religione',"==",divinita)).valueChanges()
      .pipe(map(collection=>{
          return collection.map(collection=>{
            let spell = new SpellChierico();
            spell.religione=collection.religione;
            spell.id=collection.id;
            spell.spell=collection.spell;
            return spell;
          })
      }))
      return response;
  }

  getRegni()
  {
    var response= this.store.collection<Regno>('Regno').valueChanges()
      .pipe(map(collection=>{
          return collection.map(collection=>{
            let regno = new Regno();
            regno.nome=collection.nome;
            return regno;
          })
      }))
      return response;
  }

  getDomandeRisposte()
  {
    var response= this.store.collection<DomandaRisposta>('DomandeRisposte').valueChanges()
      .pipe(map(collection=>{
          return collection.map(collection=>{
            let dr = new DomandaRisposta();
            dr.domanda=collection.domanda;
            dr.risposta=collection.risposta;
            dr.min=collection.min;
            return dr;
          })
      }))
      return response;
  }




  getInfoSkill(classe: string)
  {
    var response= this.store.collection<InfoSkill>('InfoSkill', ref=> ref.where("classe","==",classe)).valueChanges()
      .pipe(map(collection=>{
          return collection.map(collection=>{
            let dr = new InfoSkill();
            dr.info=collection.info;
            dr.nome=collection.nome;
            dr.procedura=collection.procedura;
            dr.classe=collection.classe;
            return dr;
          })
      }))
      return response;
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
    return this.getObservableRazza(this.store.collection('Razza'))as Observable<Razza[]>;
  }

  getAllTipologieSkill()
  {
    return this.getObservableTipologia(this.store.collection('TipologiaSkill'))as Observable<TipologiaSkill[]>;
  }

  AddSkill(skill: Skill)
  {
    this.store.collection("Skill").add({
      nome: skill.nome,
      classi: skill.classi,
      idTipologiaSkill: skill.idTipologiaSkill
  });
}
  AddPg(pg: Pg, guid: string, salva: boolean = false)
  {
    this.store.collection("Pg").add({
      nome: pg.nome,
      classe: pg.classe.nome,
      divinita: pg.religione.nome,
      pantheon: pg.religione.pantheon,
      razza: pg.razza.nome,
      forza: pg.stats.forza,
      destrezza: pg.stats.destrezza,
      intelligenza: pg.stats.intelligenza,
      guid: guid,
      utilizzatoNVolte: salva ? 1 : 0
  });
  }

  addSkillsPg(skill: SkillChecked, guidPg: String)
  {
    this.store.collection("SkillsPg").add({
      guidPg:guidPg,
      nomeSkill: skill.nome,
      valueSkill: skill.value,
      idTipologiaSkill: skill.idTipologiaSkill,
      idSkill: skill.id
    });
  }


  getPg(guid: string)
  {
    return this.getObservablePg(this.store.collection('Pg', ref=> ref.where('guid','==',guid))) as Observable<PartialPg[]>;
  }

  getSchedePgByClasse(classe: string)
  {
    var response= this.store.collection<PartialPg>('Pg', ref=> ref.where("classe","==",classe)).valueChanges()
      .pipe(map(collection=>{
          return collection.map(collection=>{
            let dr = new PartialPg();
            dr.nome=collection.nome;
            dr.classe=collection.classe;
            dr.destrezza=collection.destrezza;
            dr.forza=collection.forza;
            dr.intelligenza=collection.intelligenza;
            dr.guid=collection.guid;
            dr.utilizzatoNVolte = collection.utilizzatoNVolte;
            return dr;
          })
      }))
      return response;
  }

  getSkillsPg(guid: string)
  {
    return this.getObservableSkillsPg(this.store.collection('SkillsPg', ref=> ref.where('guidPg','==',guid))) as Observable<SkillsPg[]>;
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

  private getObservableSpellPaladino = (collection: AngularFirestoreCollection<SpellPaladino>) => {
    const subject = new BehaviorSubject<SpellPaladino[]>([]);
    collection.valueChanges({ idField: 'id' }).subscribe((val: SpellPaladino[]) => {
      subject.next(val);
    });
    return subject;
  }

  private getObservablePg = (collection: AngularFirestoreCollection<PartialPg>) => {
    const subject = new BehaviorSubject<PartialPg[]>([]);
    collection.valueChanges({ idField: 'id' }).subscribe((val: PartialPg[]) => {
      subject.next(val);
    });
    return subject;
  }

  private getObservableSkillsPg = (collection: AngularFirestoreCollection<SkillsPg>) => {
    const subject = new BehaviorSubject<SkillsPg[]>([]);
    collection.valueChanges({ idField: 'id' }).subscribe((val: SkillsPg[]) => {
      subject.next(val);
    });
    return subject;
  }

  private getObservableSpellChierico = (collection: AngularFirestoreCollection<SpellChierico>) => {
    const subject = new BehaviorSubject<SpellChierico[]>([]);
    collection.valueChanges({ idField: 'id' }).subscribe((val: SpellChierico[]) => {
      subject.next(val);
    });
    return subject;
  }



}
