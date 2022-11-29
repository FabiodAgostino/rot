import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  eventsSubscription = new Subscription();
  isLoading = false;

  @Input() events = new Observable<string>();
  urlIFrame = "";

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.eventsSubscription = this.events.subscribe((x) =>
    {
      this.isLoading=true;
      setTimeout(()=> {
      this.urlIFrame=x;
      this.isLoading=false;}, 2000);
        console.log("s");
    } );


  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }


}
