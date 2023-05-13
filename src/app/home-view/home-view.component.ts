import { Component, OnInit } from '@angular/core';
import { Utils } from '../utils/utility';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.css']
})
export class HomeViewComponent implements OnInit {

  constructor(private _utils:Utils, private userService: UserService, private router:Router){

  }
  ngOnInit(): void {
   this.discord();
  }

  isSmartphone()
  {
    return this._utils.isSmartphone() ? '80' : '55';
  }

  discord()
  {
    var code=this.userService.getQueryParams();
    if(code)
    {
      this.router.navigate([], {
        queryParams: {
          'code': null,
        },
        queryParamsHandling: 'merge'
      })
      const lastUrl=localStorage.getItem("lastUrl");
        if(lastUrl)
          this.router.navigate([lastUrl]);
      this.userService.loginDiscord(code).subscribe(user=>{

      });
    }

  }

  }
