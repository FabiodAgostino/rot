import { Platform } from "@angular/cdk/platform"
import { Injectable } from '@angular/core';
import { Classe, ClasseCheckBox, Skill } from "../models/Pg";

@Injectable({
  providedIn: 'root',
})
export class Utils {
  constructor(public _platform: Platform)
  {
    this.platform=_platform;
  }
  platform: Platform;

  isSmartphone() { return this.platform.ANDROID || this.platform.IOS};

}
