import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { SafePipe } from 'src/environments/selfPipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  eventsSubscription = new Subscription();
  iFrameEmitter: Subject<string> = new Subject<string>();
  @Input() events = new Observable<string>();

  constructor(public sanitizer: DomSanitizer, private _safePipe: SafePipe) { }

  ngOnInit(): void {
    this.eventsSubscription = this.events.subscribe((x) =>
    {
        this.iFrameEmitter.next(x);
    } );
  }
}
