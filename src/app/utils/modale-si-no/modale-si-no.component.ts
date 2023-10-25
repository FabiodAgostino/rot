import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modale-si-no',
  templateUrl: './modale-si-no.component.html',
  styleUrls: ['./modale-si-no.component.css']
})
export class ModaleSiNoComponent {

  constructor(public dialogRef: MatDialogRef<ModaleSiNoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  close(answer: boolean): void {
    this.dialogRef.close(answer);
  }

}
