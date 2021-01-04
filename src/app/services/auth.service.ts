import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API_URL = environment.apiUrl;

  constructor( private httpClient: HttpClient ) { }

  login(userData: {}): Observable<any> {
    return this.httpClient.post(this.API_URL + 'login', userData);
  }
}
