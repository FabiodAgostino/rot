import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomandaRisposta, Regno } from 'src/app/models/Pg';
import { User } from 'src/app/models/User';
import { SchedaPersonaggioService } from 'src/app/service/scheda-personaggio.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  user = new User();
  error= false;
  regni= new Array<Regno>();
  regno = new Regno();
  dr = new Array<DomandaRisposta>();

  firstFormGroup = this._formBuilder.group({
    username: ['', Validators.compose([Validators.minLength(4),Validators.required])],
    password: ['', Validators.compose([Validators.minLength(6),Validators.required])],

  });
  secondFormGroup = this._formBuilder.group({
    nomePg: ['', Validators.compose([Validators.minLength(3),Validators.required])],
    regno: ['', Validators.required],

  });
  isEditable = true;
  isLinear = true;
  constructor(private service:UserService, private dialog: DialogRef, private _formBuilder: FormBuilder, private _schedaService: SchedaPersonaggioService)
  {

  }
  ngOnInit(): void {
    this.getRegni();
    this.getDomandeRisposte();
  }


  signUp()
  {
    var u = Object.assign({}, this.user);
    this.service.registrati(this.user);
  }

  isLoggedIn()
  {
    return this.service.isLoggedIn;
  }

  getRegni()
  {
    this._schedaService.getRegni().subscribe(x=> this.regni=x);
  }

  getDomandeRisposte()
  {
    this._schedaService.getDomandeRisposte().subscribe(x=> this.sortDomandeRisposte(x));
  }

  sortDomandeRisposte(array: Array<DomandaRisposta>)
  {
    array.sort(() => 0.5 - Math.random());

    for(let i=0;i<3; i++)
      this.dr.push(array[i]);

  }
}
