import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { SafePipe } from 'src/environments/selfPipe';

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


  constructor(public sanitizer: DomSanitizer, private _safePipe: SafePipe) { }

  ngOnInit(): void {
    this.eventsSubscription = this.events.subscribe((x) =>
    {
      const timing = x.includes("alatar") ? 2000 : 1000;
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
