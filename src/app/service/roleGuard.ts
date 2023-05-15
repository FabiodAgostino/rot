import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Verifica se l'utente ha il ruolo richiesto per accedere alla rotta
    // Restituisci true se l'utente ha il ruolo, altrimenti false o un UrlTree per il reindirizzamento
    const requiredRole = 'Regnante';
    return this.userService.isLoggedInObs.pipe(
      map((isLoggedIn) => {
        if (isLoggedIn && this.userService.userLoggato?.ruoli?.includes(requiredRole)) {
          return true;
        } else {
          // Reindirizza a una pagina di accesso non autorizzato
          return this.router.parseUrl('/unauthorized');
        }
      })
    );
  }
}