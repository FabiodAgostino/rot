import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { type } from 'os';
import { Macro, MacroFull, MacroSettings, MacroSettingsFront, MacroToInsert } from 'src/app/models/Macro';
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
    if(data.id!=-1)
      this.detail=true;

    if(data.insert==true)
      this.insert=data.insert;
  }

  detail:boolean= false;
  insert:boolean = false;
  isUpdateable= false;

  username: string ="";
  macroFull = new MacroFull();
  tipologieMacro = new Array<string>();
  macroSettings = new Array<MacroSettings>();

  insertMacroSettings = new Array<MacroSettingsFront>();
  detailMacroSettings = new Array<MacroSettingsFront>();


  nMacro=1;

  macroFullForm = new FormGroup({
    author: new FormControl(''),
    titolo: new FormControl(''),
    tipologia: new FormControl(''),
    settings: new FormControl(''),
    descrizione: new FormControl(''),


  });

  ngOnInit(): void {
    this.inizializza();

  }

  inizializza()
  {
    this.tipologieMacro= this.service.GetTipologieMacro();
    this.checkUser();
    this.getMacroSettings();
    this.getMacro();

    if(this.detail)
    {
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
              ref2.unsubscribe();
              this.setAllValue(macro[0],macroSettings);
            }
          })
        }
      });
  }

  setAllValue(macro: MacroFull, macroSettings: MacroSettingsFront[])
  {
    this.macroFull.macro.author=macro.macro.author;
    this.macroFullForm.get('titolo')?.setValue(macro.macro.title);
    this.macroFullForm.get("descrizione")?.setValue(macro.descrizione)
    this.macroFullForm.get('tipologia')?.setValue(macro.tipologia);
    this.detailMacroSettings=macroSettings;
    this.nMacro= this.detailMacroSettings.length;
  }

  compareSettings(a:MacroSettings, b:MacroSettingsFront)
  {
    return a.comando==b.comando;
  }

  compareSottoSettings(a:MacroSettings, b:string)
  {
    return a.comando==b;
  }

  getSubSettings(comando: string)
  {
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
          this.macroFull.macro.author = user[0].nomePg;
          this.isUpdateable=true;
          rif?.unsubscribe();
        }
      });
    }
    else
    {
      if(this.insert)
      {
        this.userService.openSnackBar("registrazioneFallita","bottom","center","Effettua prima la login");
        setTimeout(() => {
            this.dialog.open(LoginComponent);
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
    this.nMacro++;

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
    return  this.macroFull.macro.author=='' || this.insertMacroSettings.length==0 || this.macroFullForm.get('tipologia')?.value=='' || this.macroFullForm.get('titolo')?.value=='';
  }

  saveMacro()
  {
    if(!this.disabledButton())
    {
      let macro = new MacroToInsert();
      macro.settings=this.insertMacroSettings;
      macro.macro.author=this.macroFull.macro.author;
      const name = this.macroFullForm.get('titolo')!.value;

      if(name)
        macro.macro.title=name;
      macro.macro.date = new Date();
      const descrizione= this.macroFullForm.get('descrizione')!.value;

      if(descrizione)
        macro.descrizione=descrizione;
      const tipologia=this.macroFullForm.get('tipologia')?.value;

      if(tipologia)
        macro.macro.tipologia=tipologia;

      macro.macro.like=0;
      macro.macro.guid = crypto.randomUUID();
      this.service.addMacros(macro);
      this.dialog.closeAll();
    }
  }



}
