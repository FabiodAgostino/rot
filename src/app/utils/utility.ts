import { Platform } from "@angular/cdk/platform"
import { Injectable } from '@angular/core';
import { FormGroup } from "@angular/forms";
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


}
