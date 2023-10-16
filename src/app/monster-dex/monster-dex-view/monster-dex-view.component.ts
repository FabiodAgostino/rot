import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FlatNode, Monster, MonsterNode } from 'src/app/models/Monster';


@Component({
  selector: 'app-monster-dex-view',
  templateUrl: './monster-dex-view.component.html',
  styleUrls: ['./monster-dex-view.component.css'],
  encapsulation: ViewEncapsulation.None 

})
export class MonsterDexViewComponent {

  @ViewChild('myModal') modalTemplate!: TemplateRef<any>;
  modalImageUrl: string = '';
  desiredWidth = 500; // Larghezza desiderata per l'immagine
  desiredHeight = 400; // Altezza desiderata per l'immagine
  text="";
  constructor(private dialog: MatDialog) {
  }

  node?: FlatNode;
  imageLoaded: boolean = false;
  imageTemplate: boolean = false;
  isFirstLoad: boolean = false;


  



  renderImage(node:FlatNode)
  {
    this.imageLoaded=false;
    this.node=node;

    const image = new Image();
    image.src = this.node.url;
    image.onload = () => {
      const originalWidth = image.width;
      const originalHeight = image.height;
      // Verifica le dimensioni e applica le dimensioni desiderate
      if (originalWidth > originalHeight) {
        this.desiredHeight = 450;
        this.desiredWidth= 550;
      } else if (originalWidth < originalHeight) {
        this.desiredWidth = (originalWidth / originalHeight) * 550;
      }
    };
  }

  openModal(): void {
    this.modalImageUrl = this.node!.url;
    const dialogRef=this.dialog.open(this.modalTemplate, {
    });
  }

  closeModal(): void {
    this.dialog.closeAll();
  }

}
