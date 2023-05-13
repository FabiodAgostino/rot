import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable()
export class AppInitializerService {
  constructor(private userService: UserService){}
  initializeApp(): Promise<any> {
   var promise= this.userService.isLogged();
    return new Promise((resolve, reject) => {
      // Esempio: attesa di 2 secondi prima di risolvere la Promise
      setTimeout(() => {
        resolve(promise);
      }, 2000);
    });
  }
}
