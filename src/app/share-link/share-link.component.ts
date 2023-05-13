import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-share-link',
  templateUrl: './share-link.component.html',
  styleUrls: ['./share-link.component.css'],
  animations: [
    trigger('copyIconTransition', [
      state('copy', style({ transform: 'rotate(0deg)', opacity: 1 })),
      state('done', style({ transform: 'rotate(0deg)', opacity: 1 })),
      transition('copy => done', [
        style({ transform: 'rotate(0deg)', opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ]),
      transition('done => copy', [
        style({ transform: 'rotate(0deg)', opacity: 1 }),
        animate('500ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ShareLinkComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data:  any, private clipboard: Clipboard, private snackBar: MatSnackBar, private dialog:MatDialog)
  {
    this.shareLink = data.link;
  }
  shareLink: string='';
  copyIcon: string = 'content_copy';
  copyTooltipText: string = 'Copia il link';
  iconState: string = 'initial';
  showCopyIcon: boolean = true;



  ngOnInit() {

    this.copyLink();
  }

  copyLink() {
    this.clipboard.copy(this.shareLink);
    this.showCopiedSnackBar();
    this.showCopyIcon = false;

    setTimeout(() => {
      this.showCopyIcon = true;
    }, 700);
  }

  showCopiedSnackBar() {
    this.snackBar.open('Link copiato negli appunti', 'Chiudi', {
      duration: 2000,
    });
  }

  closeModal() {
    this.copyIcon = 'content_copy';
    this.copyTooltipText = 'Copia il link';
    this.dialog.closeAll()
  }


}
