import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomandaRisposta, Regno } from 'src/app/models/Pg';
import { User } from 'src/app/models/User';
import { SchedaPersonaggioService } from 'src/app/service/scheda-personaggio.service';
import { UserService } from 'src/app/service/user.service';
import { Utils } from 'src/app/utils/utility';

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
  strongPassword = true;



  firstFormGroup = this._formBuilder.group({
    username: ['', Validators.compose([Validators.minLength(4),Validators.required])],
    password: ['', Validators.compose([Validators.minLength(6),Validators.required])],
    password2: ['', Validators.compose([Validators.minLength(6),Validators.required])],
  },
  {validator: this._utils.ConfirmPasswordValidator("password", "password2")}
  );

  secondFormGroup = this._formBuilder.group({
    nomePg: ['', Validators.compose([Validators.minLength(3),Validators.required])],
    regno: ['', Validators.required],
  },

  );
  thirdFormGroup = this._formBuilder.group({
    r1: ['', Validators.required],
    r2: ['', Validators.required],
    r3: ['', Validators.required]


  });

  form: FormGroup = new FormGroup({});
  isEditable = true;
  isLinear = true;
  constructor(private service:UserService, private dialog: DialogRef, private _formBuilder: FormBuilder,
    private _schedaService: SchedaPersonaggioService, private _utils: Utils, private cdRef:ChangeDetectorRef)
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

  heightTextArea(domanda: string)
  {
    let smartphone = this._utils.isSmartphone();
    if(domanda.length>=5 && domanda.length<=25)
      return !smartphone ? 23 : 40;
    if(domanda.length>25 && domanda.length<=45)
      return !smartphone ? 35 : 60;
    if(domanda.length>45 && domanda.length<=55)
      return !smartphone ? 40 : 65;
    if(domanda.length>55 && domanda.length<=60)
      return !smartphone ? 45 : 75;
    if(domanda.length>60 && domanda.length<=75)
    return !smartphone ? 50 : 85;
    return !smartphone ? domanda.length*0.63 : domanda.length*1.10;
  }

  checkUser(username: string)
  {
    this.service.checkUser(username).subscribe(x=>{
      if(x.length>0)
        this.firstFormGroup.get("username")?.setErrors({'incorrect': true});

    });
  }

  onPasswordStrengthChanged(event: boolean) {
      if(event===false)
        this.firstFormGroup.get("password")?.setErrors({'passwordEasy': true});
    this.cdRef.detectChanges();

  }

  salva()
  {
    var regno = this.secondFormGroup.get("regno")?.value;
    var isOk=true;
    if(regno?.includes("Rotiniel"))
    {
      const dr= this.dr;
      var r = new Array<String>();
      var r1= this.thirdFormGroup.get('r1')?.value;
      var r2= this.thirdFormGroup.get('r2')?.value;
      var r3= this.thirdFormGroup.get('r3')?.value;
      let check = new Array<boolean>;

      if(r1 && r2 && r3)
      {
        r.push(r1);
        r.push(r2);
        r.push(r3);
        for(let i=0;i<r?.length;i++)
        {
        if(r[i].length>=dr[i].min &&  dr[i].risposta.toLowerCase().includes(r[i].toLowerCase()))
          check.push(true);
        }
      }
       isOk=check.filter(x=> x==true)?.length==3 ? true : false;
    }

    if(isOk)
    {
      var username=this.firstFormGroup.get("username")?.value;
      var password=this.firstFormGroup.get("password")?.value;
      var nomePg=this.secondFormGroup.get("nomePg")?.value;

      if(username && password && nomePg && regno)
      {
        var user = new User(username,password);
        user.nomePg=nomePg;
        user.regno=regno;
        this.service.registrati(user);
        this.service.openSnackBar("registrazioneAvvenuta");
        this.dialog.close(user);
      }
    }
    else
      this.service.openSnackBar("registrazioneFallita");

    this.dialog.close();
  }
}
