import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { type } from 'os';
import { Macro, MacroFull, MacroFullFromXml, MacroSettings, MacroSettingsFront, MacroToInsert } from 'src/app/models/Macro';
import { User } from 'src/app/models/User';
import { MacroService } from 'src/app/service/macro.service';
import { UserService } from 'src/app/service/user.service';
import { LoginComponent } from 'src/app/user/login/login.component';
import { Utils } from 'src/app/utils/utility';

@Component({
  selector: 'app-macro-insert-edit',
  templateUrl: './macro-insert-edit.component.html',
  styleUrls: ['./macro-insert-edit.component.css']
})
export class MacroInsertEditComponent implements OnInit{

  constructor(public utils: Utils, public service: MacroService, @Inject(MAT_DIALOG_DATA)
  public data:  any, public userService: UserService, public dialog: MatDialog)
  {
    if(data)
    {
      if(data.id!=-1)
        this.detail=true;

      if(data.insert==true)
        this.insert=data.insert;
    }
  }
  @Input() macroMultiInsert?:MacroFullFromXml;
  @Output() editMacro = new EventEmitter<MacroFullFromXml>();
  multiInsert:boolean = false;

  detail:boolean= false;
  insert:boolean = false;
  isUpdateable= false;
  edit=false;

  username: string ="";
  macroFull = new MacroFull();
  tipologieMacro = new Array<string>();
  macroSettings = new Array<MacroSettings>();

  insertMacroSettings = new Array<MacroSettingsFront>();
  detailMacroSettings = new Array<MacroSettingsFront>();

  utenteLoggato: string="";

  macroFullForm = new FormGroup({
    author: new FormControl(''),
    titolo: new FormControl(''),
    tipologia: new FormControl(''),
    settings: new FormControl(''),
    descrizione: new FormControl(''),
    delay: new FormControl('0', Validators.minLength(0)),

  });

  ngOnChanges(changes: SimpleChanges) {
  if(this.macroMultiInsert)
    this.setMultiInsert();
}

setMultiInsert()
{
  this.multiInsert=true;
  this.macroFullForm.get('titolo')?.setValue(this.macroMultiInsert!.macro.macro.title);
  this.macroFullForm.get('descrizione')?.setValue(this.macroMultiInsert!.macro.descrizione);
  const tipologia= this.macroFullForm.get('tipologia')?.setValue(this.macroMultiInsert!.macro.tipologia);



  if(this.macroMultiInsert?.checked==true)
    this.edit=true;
  else
    this.edit=false;
}

editMultiInsert()
{
  const descrizione= this.macroFullForm.get('descrizione')?.value;
  if(descrizione)
    this.macroMultiInsert!.macro.descrizione = descrizione;

  const titolo= this.macroFullForm.get('titolo')?.value;
  if(titolo)
    this.macroMultiInsert!.macro.macro.title = titolo;

  const tipologia= this.macroFullForm.get('tipologia')?.value;
  if(tipologia)
    this.macroMultiInsert!.macro.macro.tipologia = tipologia;

  this.editMacro.emit(this.macroMultiInsert);
}

  ngOnInit(): void {
    this.inizializza();
  }

  inizializza()
  {
    this.tipologieMacro= this.service.GetTipologieMacro();
    if(!this.macroMultiInsert)
    {
      this.checkUser();
      this.getMacroSettings();
      this.getMacro();

    }
  }

  getMacro()
  {
    const ref=this.service.getMacro(this.data.id).subscribe(macro=>
      {
        if(macro[0]?.macro.author)
        {
          ref.unsubscribe();
          const ref2=this.service.getMacroSettingsUser(this.data.id).subscribe(macroSettings=>{
            if(macroSettings.length>0)
            {
              this.setAllValue(macro[0],macroSettings);
              ref2.unsubscribe();
            }
          })
        }
      });
  }

  setAllValue(macro: MacroFull, macroSettings: MacroSettingsFront[])
  {
    this.macroFull.macro.author=macro.macro.author;
    this.macroFull.macro.date=macro.macro.date;
    this.macroFull.macro.like=macro.macro.like;
    this.macroFull.macro.guid=macro.macro.guid;
    this.macroFull.macro.utenti=macro.macro.utenti;
    this.macroFullForm.get('titolo')?.setValue(macro.macro.title);
    this.macroFullForm.get("descrizione")?.setValue(macro.descrizione)
    this.macroFullForm.get('tipologia')?.setValue(macro.tipologia);
    this.macroFullForm.get('delay')?.setValue(macro.macro.delay.toString());
    this.detailMacroSettings=macroSettings.sort(function(a, b) { return a.index > b.index ? 1 : -1});
  }

  compareSettings(a:MacroSettings, b:MacroSettingsFront)
  {
    return a.comando==b.comando;
  }

  compareSottoSettings(a:string, b:string)
  {
    return a==b;
  }

  getSubSettings(comando: string)
  {

    document.getElementById("targetRed")!.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest"
    });

    return this.macroSettings.filter(x=> x.comando==comando)[0].settings;

  }

  checkUser()
  {
    const md5=localStorage.getItem("user")?.toString();
    if(md5)
    {
      const rif=this.userService.checkUserMd5(md5).subscribe(user=> {
        if(user.length>0)
        {
          this.utenteLoggato=user[0].nomePg;
          if(this.utenteLoggato===this.macroFull.macro.author)
            this.isUpdateable=true;

          if(this.insert && this.utenteLoggato!=null)
            this.macroFull.macro.author=this.utenteLoggato;
          rif?.unsubscribe();
        }
        rif.unsubscribe();
      });
    }
    else
    {
      if(this.insert)
      {
        this.userService.openSnackBar("registrazioneFallita","bottom","center","Effettua prima la login");
        setTimeout(() => {
            const rif=this.dialog.open(LoginComponent);

        }, 500);
      }
    }

  }

  getMacroSettings()
  {
      this.service.getMacroSettings().subscribe( x=> this.macroSettings=x);
  }
  addMacro()
  {
    if(this.insert)
      this.insertMacroSettings.push(new MacroSettingsFront());
    if(this.edit)
      this.detailMacroSettings.push(new MacroSettingsFront());

      document.getElementById("targetRed")!.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest"
      });
  }

  eliminaMacroEdit(index: number)
  {
    if (index > -1 && this.edit) {
      this.detailMacroSettings.splice(index, 1);
    }

    if (index > -1 && this.insert) {
      this.insertMacroSettings.splice(index, 1);
    }
  }

  editSettings(macro: MacroSettings, index: number)
  {

    if(this.detailMacroSettings[index]?.comando==undefined)
      this.detailMacroSettings[index]= new MacroSettingsFront();

    this.detailMacroSettings[index].comando=macro.comando;
    this.detailMacroSettings[index].type=macro.type;
    this.detailMacroSettings[index].settings=macro.settings;
    this.detailMacroSettings[index].function='';
  }



  editSubSettings(setting: any, index: number)
  {
    if (typeof setting === 'string' )
        this.detailMacroSettings[index].function=setting;
    else
      this.detailMacroSettings[index].function=setting.value;

      document.getElementById("targetRed")!.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest"
      });
  }

  addMacroToList(macro:MacroSettings,index:number)
  {
    if(this.insertMacroSettings[index]?.comando==undefined)
      this.insertMacroSettings[index]= new MacroSettingsFront();
    this.insertMacroSettings[index].comando=macro.comando;
    this.insertMacroSettings[index].settings=macro.settings;
    this.insertMacroSettings[index].type=macro.type;

  }

  addMacroToListUpdate(index:number, setting:string='',event: any)
  {
    if(setting!='')
      this.insertMacroSettings[index].function=setting;
    if(event)
      this.insertMacroSettings[index].function=event.target.value;
  }

  disabledButton()
  {
    return  this.macroFull.macro.author=='' || this.insertMacroSettings[0]==undefined || this.insertMacroSettings[0]?.comando=="" || this.macroFullForm.get('delay')?.value=='' || this.macroFullForm.get('tipologia')?.value=='' || this.macroFullForm.get('titolo')?.value=='';
  }

  disabeldEditButton()
  {
    return  this.macroFull.macro.author=='' || this.detailMacroSettings[0]==undefined || this.detailMacroSettings[0]?.comando=="" ||this.macroFullForm.get('delay')?.value=='' ||  this.macroFullForm.get('tipologia')?.value=='' || this.macroFullForm.get('titolo')?.value=='';
  }

  saveMacro()
  {

    if(!this.disabledButton() || (this.edit && !this.disabeldEditButton()))
    {
      let macro = new MacroToInsert();
      macro.macro.author=this.macroFull.macro.author;

      const name = this.macroFullForm.get('titolo')!.value;
      if(name)
        macro.macro.title=name;

      const descrizione= this.macroFullForm.get('descrizione')!.value;
      if(descrizione)
        macro.descrizione=descrizione;


      const tipologia=this.macroFullForm.get('tipologia')?.value;
      if(tipologia)
        macro.macro.tipologia=tipologia;

      const delay=this.macroFullForm.get('delay')?.value;
      if(delay)
        macro.macro.delay=Number(delay);

      if(this.insert)
      {
        macro.settings=this.orderMacro(this.insertMacroSettings);
        macro.macro.date = new Date();
        macro.macro.like=0;
        macro.macro.guid = crypto.randomUUID();
        this.service.addMacros(macro);
      }
      if(this.edit)
      {

        macro.settings=this.orderMacro(this.detailMacroSettings);
        macro.macro.date = this.macroFull.macro.date;
        macro.macro.like = this.macroFull.macro.like;
        macro.macro.guid=this.macroFull.macro.guid;

        this.service.updateMacro(macro);
      }
      this.dialog.closeAll();
    }
  }

  orderMacro(array: Array<MacroSettingsFront>)
  {
    for(let i=0;i<array.length;i++)
    {
      array[i].index=i;
    }
    return array;
  }

  deleteMacro()
  {
    if(confirm("Sei sicuro di voler cancellare la macro?"))
    {
      this.service.deleteMacro(this.macroFull.macro.guid);
      this.dialog.closeAll();
    }
  }

  checkThumb()
{
  return this.detail && !this.macroFull.macro.utenti.includes(this.utenteLoggato) && this.utenteLoggato!='';
}

checkIfVote()
{
  return this.macroFull.macro.utenti.includes(this.utenteLoggato);
}

likeIt()
{
  const ref=this.service.addLikeMacro(this.macroFull.macro.guid,this.utenteLoggato).subscribe(x=>{
    if(x)
    {
      this.getMacro();
      ref.unsubscribe();
    }
  });
}









}
