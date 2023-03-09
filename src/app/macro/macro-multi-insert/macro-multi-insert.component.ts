import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MacroFull, MacroFullFromXml } from 'src/app/models/Macro';
import { UserService } from 'src/app/service/user.service';
import { MacroXml } from 'src/app/utils/utility';

@Component({
  selector: 'app-macro-multi-insert',
  templateUrl: './macro-multi-insert.component.html',
  styleUrls: ['./macro-multi-insert.component.css']
})
export class MacroMultiInsertComponent implements OnInit{

  constructor(@Inject(MAT_DIALOG_DATA) public data:  any, private userService: UserService)
  {
    if(data.macros!=null)
      this.macros=data.macros;
  }
  macros = new Array<MacroFullFromXml>();
  macro = new MacroFullFromXml;
  index: number =0;
  ngOnInit(): void {
    this.macro= this.macros[0];
    this.checkUser();
  }

  changeScheda(rightLeft: string)
  {
    if(rightLeft=="right" && this.index<this.macros.length-1)
      this.index++;
    else if(rightLeft=="left" && this.index>0)
      this.index--;

    this.macro=this.macros[this.index];
  }

  resetMacro()
  {
    this.macro = Object.assign({},this.macro);
  }

  checkUser()
  {
    const md5=localStorage.getItem("user")?.toString();
    if(md5)
    {
      const rif=this.userService.checkUserMd5(md5).subscribe(user=> {
        if(user.length>0)
        {
          this.macros.forEach(x=> x.macro.macro.author=user[0].nomePg)
          rif?.unsubscribe();
        }
        rif.unsubscribe();
      });
    }
  }

  setMacro($event: MacroFullFromXml)
  {
    this.macro=$event;
  }



}

