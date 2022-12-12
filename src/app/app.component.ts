import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'newprova4';

  constructor(private userService: UserService)
  {

  }
  ngOnInit(): void {
    this.userService.checkSession()
    const source = interval(150000);
    source.subscribe(val => this.userService.checkSession());
  }
}


