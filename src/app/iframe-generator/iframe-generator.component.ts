import { Platform } from '@angular/cdk/platform';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { SafePipe } from 'src/environments/selfPipe';
import { Utils } from '../utils/utility';

@Component({
  selector: 'app-iframe-generator',
  templateUrl: './iframe-generator.component.html',
  styleUrls: ['./iframe-generator.component.css']
})
export class IframeGeneratorComponent implements OnInit {

  isLoading = false;
  itsSafe: SafeHtml | undefined;
  private safePipe: SafePipe = new SafePipe(this.sanitizer);
  eventsSubscription = new Subscription();
  @Input() events = new Observable<string>();
  urlIFrame = "";
  isSmartphone=false;

  constructor(public sanitizer: DomSanitizer, private _safePipe: SafePipe, private utils: Utils) { }

  ngOnInit(): void {
    this.isSmartphone=this.utils.isSmartphone();
    this.eventsSubscription = this.events.subscribe((x) =>
    {
      const timing = x.includes("alatar") ? 2300 : 1000;
      this.urlIFrame=x;
      if(x!="")
      {
        this.isLoading=true;
        setTimeout(()=> {
        this.isLoading=false;}, timing);
      }
    } );


  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }



}
