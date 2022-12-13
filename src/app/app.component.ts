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
    var user=localStorage.getItem("user")?.toString();
    this.userService.isLoggedIn = user===undefined ? false : true;
    const source = interval(150000);
    source.subscribe(val => this.userService.checkSession());
  }
}


