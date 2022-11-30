import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { SafePipe } from 'src/environments/selfPipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  eventsSubscription = new Subscription();
  isLoading = false;
  itsSafe: SafeHtml | undefined;
  private safePipe: SafePipe = new SafePipe(this.sanitizer);

  @Input() events = new Observable<string>();
  urlIFrame = "";

  constructor(public sanitizer: DomSanitizer, private _safePipe: SafePipe) { }

  ngOnInit(): void {
    this.eventsSubscription = this.events.subscribe((x) =>
    {
      if(x!="")
      {
        this.isLoading=true;
        setTimeout(()=> {
        this.urlIFrame=x;
        this.isLoading=false;}, 1000);
      }
      else
      {
        this.urlIFrame=x;
      }
    } );


  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

}
