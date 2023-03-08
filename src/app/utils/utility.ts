import { Platform } from "@angular/cdk/platform"
import { Injectable } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { Classe, ClasseCheckBox, Skill } from "../models/Pg";
import { NgxXml2jsonService } from 'ngx-xml2json';
import { MacroService } from "../service/macro.service";
import { MacroFullFromXml, MacroSettings, MacroSettingsFront } from "../models/Macro";

@Injectable({
  providedIn: 'root',
})
export class Utils {
  constructor(public _platform: Platform, private ngxXml2jsonService: NgxXml2jsonService, private macroService: MacroService)
  {
    this.platform=_platform;
  }
  platform: Platform;

  isSmartphone() { return this.platform.ANDROID || this.platform.IOS};

  ConfirmPasswordValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      let control = formGroup.controls[controlName];
      let matchingControl = formGroup.controls[matchingControlName]
      if (
        matchingControl?.errors &&
        !matchingControl?.errors["confirmPasswordValidator"]
      ) {
        return;
      }
      if (control?.value !== matchingControl?.value) {
        matchingControl?.setErrors({ confirmPasswordValidator: true });
      } else {
        matchingControl?.setErrors(null);
      }
    };
  }

  MacrosXmlToObject(xml: string)
  {
    const parser = new DOMParser();
    const newXml = parser.parseFromString(xml, 'text/xml');
    const obj = this.ngxXml2jsonService.xmlToJson(newXml);
    var array=((obj as any).macros.macro as Array<any>);

    let macros = new Array<MacroXml>();
    array.forEach(x=>{
      let macro = new MacroXml();
      macro.name=x["@attributes"].name;
      let actions=(x.actions['action'] as Array<any>);

      if(actions.length===undefined)
      {
        var act=(actions as any)["@attributes"];
        macro.action.push(new ActionXml(act.code, act.subcode, act.submenutype,act.text ? act.text : null));
      }
      else
      {
        actions.forEach(acti=>{
          var act=acti["@attributes"];
          macro.action.push(new ActionXml(act.code, act.subcode, act.submenutype,act.text ? act.text : null));
        })
      }
      macros.push(macro);
    })
    let notReturn = ["Paperdoll","Options","Journal","Backpack","Radar","Bow","Salute"];
    return macros.filter(x=> !notReturn.includes(x.name));
  }

  getAllMacrosByXml(xml: string)
  {
    var array= this.MacrosXmlToObject(xml);
    var arrayMacro = new Array<MacroFullFromXml>();

    this.macroService.getMacroSettings().subscribe(x=>{
      let macroSettings=x;
      array.forEach(macrosXml=>{
        let macroFull = new MacroFullFromXml();
        macroFull.macro.macro.title=macrosXml.name;
        macrosXml.action.forEach(macroXml=>{
            let macroFront= new MacroSettingsFront();
            let set=macroSettings.find(x=> x.code==macroXml.code);
            if(set?.settings)
              macroFront.settings=set?.settings;

            if(set?.comando)
              macroFront.comando = set?.comando;

            if(set?.type)
              macroFront.type=set?.type;

            let lenghtSettings=set?.settings.length;
            if(lenghtSettings)
              for(let i=0;i<lenghtSettings;i++)
              {
                if(set?.subCode!=null && macroXml.subcode==set?.subCode[i])
                  macroFront.function =set.settings[i];
              }

            // let subcode=set?.settings[Number(macroXml.subcode)-1]
            // if(subcode)
            //   macroFront.function = subcode;

            let text = macroXml.text
            if(text)
              macroFront.function=text;

            macroFull.settings.push(macroFront);
        })
        arrayMacro.push(macroFull);
      })
    });
    console.log(arrayMacro)
    return arrayMacro;
  }
}



export class MacroXml
{
  name!:string;
  action = new Array<ActionXml>();
}

export class ActionXml
{
  code!:string;
  subcode!:string;
  subMenuType!:string;
  text!:string;


  constructor(code: string, subcode: string, subMenuType: string,text:string)
  {
    this.code=code;
    this.subcode=subcode;
    this.subMenuType=subMenuType;
    this.text = text ? text : '';
  }
}

