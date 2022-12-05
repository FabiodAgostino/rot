import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-finish-wizard',
  templateUrl: './finish-wizard.component.html',
  styleUrls: ['./finish-wizard.component.css']
})
export class FinishWizardComponent implements OnInit  {

  constructor(private _activatedRoute: ActivatedRoute){ }

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(params => console.log('queryParams', params['guid']));

  }


}
