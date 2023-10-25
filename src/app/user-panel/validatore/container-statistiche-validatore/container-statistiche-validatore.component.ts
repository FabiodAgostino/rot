import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FullStatistica } from 'src/app/models/Statistiche';

@Component({
  selector: 'app-container-statistiche-validatore',
  templateUrl: './container-statistiche-validatore.component.html',
  styleUrls: ['./container-statistiche-validatore.component.css']
})
export class ContainerStatisticheValidatoreComponent {

  statistica?:FullStatistica;
  immagini?:Array<string>;
  index:number=0;
  modalImageUrl?:string;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public dialog:MatDialog) {
    if(data.statistica!=null)
      this.statistica=data.statistica;
    if(data.immagini!=null)
      this.immagini=data.immagini;
  }
  @ViewChild('myModal') modalTemplate!: TemplateRef<any>;
  dialogImage?: MatDialogRef<any, any>;
  setIndex(text:string)
  {
    if(text=="left")
      if(this.index>0)
        this.index--;
    if(text=="right")
      if((this.index+1)< this.immagini?.length!)
        this.index++;
    console.log( this.immagini![this.index])
  }

  openModal(): void {
    this.modalImageUrl = this.immagini![this.index];
    this.dialogImage=this.dialog.open(this.modalTemplate, {
    });
  }

  closeModal(): void {
    this.dialogImage?.close();
  }
}
