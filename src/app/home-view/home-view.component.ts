import { Component } from '@angular/core';
import { Utils } from '../utils/utility';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.css']
})
export class HomeViewComponent {

  constructor(private _utils:Utils){

  }

  isSmartphone()
  {
    return this._utils.isSmartphone() ? '80' : '55';
  }

  }
