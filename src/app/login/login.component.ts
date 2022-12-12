import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  user = new User();
  error= false;
  constructor(private service:UserService, private dialog: DialogRef)
  {

  }
  ngOnInit(): void {
  }


  login()
  {
    var u = Object.assign({}, this.user);
    this.service.login(u).subscribe(x=>{
      if(x)
        this.dialog.close();
      else
        this.error=true;
    });
  }

  isLoggedIn()
  {
    return this.service.isLoggedIn;
  }

}
