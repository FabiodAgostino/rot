import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../models/User';
import { UserService } from '../../service/user.service';
import { SignUpComponent } from '../sign-up/sign-up.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  user = new User();
  error= false;
  constructor(private service:UserService, private dialog: MatDialogRef<LoginComponent>, private modal: MatDialog)
  {

  }
  ngOnInit(): void {
  }


  login()
  {
    var u = Object.assign({}, this.user);
    const ref=this.service.login(u).subscribe(x=>{
      if(x)
        this.dialog.close(x);
      else
        this.error=true;

      ref.unsubscribe();
    });
  }



  isLoggedIn()
  {
    return this.service.isLoggedIn;
  }

  openRegistrati()
  {
    this.modal.open(SignUpComponent, {
      width: "500px"
    });
  }



}
