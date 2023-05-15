import { Platform } from "@angular/cdk/platform"
import { Injectable } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { Classe, ClasseCheckBox, Skill } from "../models/Pg";
import { NgxXml2jsonService } from 'ngx-xml2json';
import { MacroService } from "../service/macro.service";
import { MacroFullFromXml, MacroSettings, MacroSettingsFront } from "../models/Macro";
import { Subject } from "rxjs";
import { roleCostants } from "./constants";
import { ActivatedRoute, Router, UrlSegment } from "@angular/router";

const SUBCODE = [{"macro":"NW","subcode":"1"},{"macro":"N","subcode":"2"},{"macro":"NE","subcode":"3"},{"macro":"E","subcode":"4"},{"macro":"SE","subcode":"5"},{"macro":"S","subcode":"6"},{"macro":"SW","subcode":"7"},{"macro":"W","subcode":"8"},{"macro":"Anatomia","subcode":"21"},{"macro":"Zoologia","subcode":"22"},{"macro":"Addomesticare","subcode":"23"},{"macro":"OsservareArmi","subcode":"24"},{"macro":"Sbirciare","subcode":"25"},{"macro":"AdorareTM","subcode":"26"},{"macro":"ScovareNascondigli","subcode":"27"},
{"macro":"Infuriarsi","subcode":"28"},{"macro":"PercezioneMagica","subcode":"29"},{"macro":"AnalizzareCorpi","subcode":"30"},{"macro":"Nascondersi","subcode":"31"},{"macro":"GodersiTM","subcode":"32"},{"macro":"Religione","subcode":"33"},
{"macro":"IdentificareOggetti","subcode":"34"},{"macro":"Meditare","subcode":"35"},{"macro":"Calmare","subcode":"36"},{"macro":"Avvelenare","subcode":"37"},{"macro":"Istigare","subcode":"38"},{"macro":"DisarmareTrappole","subcode":"39"},
{"macro":"AscoltareSpiriti","subcode":"40"},{"macro":"Rubare","subcode":"41"},{"macro":"MuoversiSilenziosamente","subcode":"42"},{"macro":"RingraziareTM","subcode":"43"},{"macro":"SeguireTracce","subcode":"44"},{"macro":"LeftHand","subcode":"45"},
{"macro":"RightHand","subcode":"46"},{"macro":"Hostile","subcode":"193"},{"macro":"Party","subcode":"194"},{"macro":"Mobile","subcode":"195"}]

@Injectable({
  providedIn: 'root',
})
export class Utils {
  constructor(public _platform: Platform, private ngxXml2jsonService: NgxXml2jsonService, private macroService: MacroService, private activatedRoute:ActivatedRoute, private route:Router)
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

  navigateOutAdmin()
  {
    const currentPath = this.getCurrentPath();
    const allowedPaths = ['/admin', '/utenti', '/tickets', '/flussoDati', '/aggiungiNews'];
    if (allowedPaths.includes(currentPath!)) {
      this.route.navigate(['/']);
    }
  }
  getCurrentPath(): string {
    let currentRoute = this.activatedRoute.snapshot;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    return this.getFullPath(currentRoute.url);
  }

  getFullPath(urlSegments: UrlSegment[]): string {
    const pathSegments = urlSegments.map(segment => segment.path);
    return `/${pathSegments.join('/')}`;
  }

  compareDates(targetDate:any) {
    const currentDate= new Date(Date.now());
    const millisecondi = Math.floor(targetDate.nanoseconds / 1000000);
    const millisecondiTotali = (targetDate.seconds * 1000) + millisecondi;

    const dataFinale = new Date(millisecondiTotali);

    if (currentDate > dataFinale)
      return true;
    return false;
  }

  addMillisecondsToCurrentDate(milliseconds:number) {
    const targetDate = new Date(Date.now() + milliseconds);
    return targetDate;
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
    var subject = new Subject<Array<MacroFullFromXml>>();
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
            if(set!==undefined)
            {
              if(set?.settings)
                macroFront.settings=set?.settings;

              if(set?.comando)
                macroFront.comando = set?.comando;

              if(set?.type)
                macroFront.type=set?.type;

              if(macroXml.subcode!='0')
                macroFront.function=SUBCODE.filter(x=> x.subcode===macroXml.subcode)[0].macro;

              let text = macroXml.text
              if(text)
                macroFront.function=text;

              macroFull.settings.push(macroFront);
            }
        })
        if(macroFull.macro.macro.title!='')
          arrayMacro.push(macroFull);
      })
      subject.next(arrayMacro);

    });
    return subject.asObservable();
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

export class RolesDiscord
{
  static getRuoliFromRoles(roles: string[])
  {
    var ruoli = new Array<string>();
    roles.forEach(x=>{
      switch(x)
      {
        case roleCostants.cittadino: ruoli.push('Cittadino'); break;
        case roleCostants.regnante: ruoli.push('Regnante'); break;
        case roleCostants.valinrim: ruoli.push('Valinrim'); break;
        case roleCostants.zingaro: ruoli.push('Ceorita'); break;
        case roleCostants.senatore: ruoli.push('Regnante'); break;
      }
    })
    return ruoli;
  }
}

