import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import Utils from '../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string;
  constructor(private http: HttpClient) { 
    this.baseUrl = Utils.getUrlAPI();
  }

  loginUser(user: AuthData) {
    return this.http.post(this.baseUrl + '/login', user);
  }

}
