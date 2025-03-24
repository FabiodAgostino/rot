import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { UserService } from './service/user.service';
import { environment } from '../environments/environment';
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
      console.log('Firebase Config:', environment.firebaseConfig);
  }
}



