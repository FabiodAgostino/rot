import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SafeHtml, SafeScript, SafeUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  constructor() { }
  iFrameEmitter: Subject<string> = new Subject<string>();
  boolHome= false;

  ngOnInit(): void {
  }

  goChild(url: string)
  {
    this.boolHome=true;
    setTimeout(()=> {
      this.iFrameEmitter.next(url);}, 100);


  }



}
