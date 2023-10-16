import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardUtente  {
    constructor(private userService: UserService, private router: Router) {}
  
    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.userService.isLoggedInObs.pipe(
        map((isLoggedIn) => {
          console.log(isLoggedIn)
          if (isLoggedIn ) {
            return true;
          } else {
            return this.router.parseUrl('/');
          }
        })
      );
    }
  }