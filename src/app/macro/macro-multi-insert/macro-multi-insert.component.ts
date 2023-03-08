import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MacroFull, MacroFullFromXml } from 'src/app/models/Macro';
import { MacroXml } from 'src/app/utils/utility';

@Component({
  selector: 'app-macro-multi-insert',
  templateUrl: './macro-multi-insert.component.html',
  styleUrls: ['./macro-multi-insert.component.css']
})
export class MacroMultiInsertComponent implements OnInit{

  constructor(@Inject(MAT_DIALOG_DATA) public data:  any)
  {
    if(data.macros!=null)
      this.macrosXml=data.macros;
  }
  macrosXml = new Array<MacroXml>();
  macros = new Array<MacroFullFromXml>();
  macro = new MacroFullFromXml;
  index: number =0;
  ngOnInit(): void {

    this.macro= this.macros[0];
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



}

