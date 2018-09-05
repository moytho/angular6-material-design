import { Subject } from 'rxjs/Subject';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { UIService } from '../shared/ui.service';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private user: User;
  loginResult;

constructor(private router:Router, 
    private userService: UserService,
    private uiService: UIService
  ) {
    
    this.authChange.next(true);

}

  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      name: "Erick",
      userId: Math.round(Math.random() * 10000).toString(),
      token: ""
    };
    this.authSuccessfully();
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.userService.loginUser(authData)
    .subscribe( 
      data => {
      
        this.loginResult = data;

        this.user = {
        email: authData.email,
        name: this.loginResult.data.name,
        userId: this.loginResult.data.id,
        token: this.loginResult.data.api_token
      }

      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackBar("Logged in successfully", null, 3000);
      
      localStorage.setItem('currentUser', 
        JSON.stringify({ 
          email: authData.email, 
          token: this.loginResult.data.api_token, 
          name: this.loginResult.data.name 
        }) 
      );

      console.log("localstorage")
      console.log(JSON.parse(localStorage.getItem('currentUser')))

      this.authSuccessfully();


    },
    error => {
      console.log("error")
      console.log(error);
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackBar("An error has occurred. Check your user credentials.", null, 3000);
    }
  );

  }

  currentUser(){
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  logout() {
    this.user = null;
    localStorage.setItem('currentUser', null);
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  getUser() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return { ...currentUser };
  }

  isAuth() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.authChange.next(true);
    return currentUser != null;
  }

  private authSuccessfully(){
    this.authChange.next(true);
    this.router.navigate(['/customer']);
  }

}
