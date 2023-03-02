import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Macro, MacroFull } from 'src/app/models/Macro';
import { User } from 'src/app/models/User';
import { MacroService } from 'src/app/service/macro.service';
import { UserService } from 'src/app/service/user.service';
import { Utils } from 'src/app/utils/utility';

@Component({
  selector: 'app-macro-insert-edit',
  templateUrl: './macro-insert-edit.component.html',
  styleUrls: ['./macro-insert-edit.component.css']
})
export class MacroInsertEditComponent implements OnInit{

  constructor(public utils: Utils, public service: MacroService, @Inject(MAT_DIALOG_DATA)
  public data:  any, public userService: UserService)
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

  macroFullForm = new FormGroup({
    author: new FormControl(''),
    macro: new FormControl(''),
    tipologia: new FormControl('')
  });

  ngOnInit(): void {
    this.inizializza();

    if(this.detail)
      this.getMacro();
  }

  inizializza()
  {
    this.tipologieMacro= this.service.GetTipologieMacro();
    this.checkUser();
  }

  getMacro()
  {
    this.service.getMacro(this.data.id);
  }

  checkUser()
  {
    const md5=localStorage.getItem("user")!.toString();

    const rif=this.userService.checkUserMd5(md5).subscribe(user=> {
      if(user.length>0)
      {
        this.macroFull.macro.author = user[0].nomePg;
        this.isUpdateable=true;
        rif?.unsubscribe();
      }
    });
  }

}
