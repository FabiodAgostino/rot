import { Component, Input, SimpleChanges } from '@angular/core';
import { FullStatistica } from 'src/app/models/Statistiche';

@Component({
  selector: 'app-modal-validatore',
  templateUrl: './modal-validatore.component.html',
  styleUrls: ['./modal-validatore.component.css']
})
export class ModalValidatoreComponent {

  @Input() stat?: FullStatistica;
  mediaPg?:string;

  constructor() {
  }
  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    console.log(this.stat?.statistica?.numPg)
  }

}
