import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FullServerDiscord } from 'src/app/models/discord';

@Component({
  selector: 'app-lookup-servers',
  templateUrl: './lookup-servers.component.html',
  styleUrls: ['./lookup-servers.component.css']
})
export class LookupServersComponent {
  servers = new Array<FullServerDiscord>();
  selectedServer = new FullServerDiscord();
  constructor(@Inject(MAT_DIALOG_DATA) public data:  Array<FullServerDiscord>, public dialogRef: MatDialogRef<LookupServersComponent>) {
    if(data)
      this.servers=data;
  }

  change()
  {
    this.dialogRef.close(this.selectedServer);
  }

}
