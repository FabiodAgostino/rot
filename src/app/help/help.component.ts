import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Ticket } from '../models/Tickets';
import { UserService } from '../service/user.service';
import { Utils } from '../utils/utility';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder, private _userService: UserService, private _utils: Utils) { }

  tipologiaTicket = ["Correzione dati tool","Malfunzionamento","Consigli"];
  tools = ["Scheda personaggio","Dizionario Elfico","Enchant TM","Calendario TM","Armature infuse", "Macro Utili"];
  firstFormGroup = this._formBuilder.group({
    user: ['', Validators.required],
    tipologia: ['', Validators.required],
    tool: [''],
    ticket:['', Validators.compose([Validators.minLength(20),Validators.required])],
  });
  isLoggedIn: boolean=false;

  ngOnInit(): void {
    this.isSmartphone();
    this._userService.isLoggedInObs.subscribe(x=>{
      this.isLoggedIn=x;
      if(!this.isLoggedIn)
        this._userService.openSnackBar("effettuaLogin")
    })
  }

  salva()
  {
    if(this.firstFormGroup.valid)
    {
      var r1= this.firstFormGroup.get('tipologia')?.value;
      var r3= this.firstFormGroup.get('ticket')?.value;
      var r2= this.firstFormGroup.get('tool')?.value;

      if(!r2)
        r2="Blank";


      if(r1 && r3 && r2)
      {
        var ticket = new Ticket(r1,r2,r3);
        var u= this.firstFormGroup.get('user')?.value;
        var u2= localStorage.getItem("user");

        if(!this.isLoggedIn && u)
           ticket.user = u;
        if(this.isLoggedIn && u2)
          ticket.user = u2;

        this._userService.SalvaTicket(ticket);

        this.firstFormGroup.reset();
      }
    }
  }


  isSmartphone()
  {
    return this._utils.isSmartphone();
  }

  width()
  {
    return this.isSmartphone() ? '100' : '50';
  }


}
