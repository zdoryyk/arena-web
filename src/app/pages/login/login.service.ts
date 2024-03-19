import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {

   }


   getToken(casToken: any): Observable<any> {
    return this.http.post(environment.api_url + "/token", casToken);
  }

  getUserMe(token: any): Observable<any> {
    var routePath = environment.api_url + "/users/me";
    return this.http.get<any>(routePath, {
      headers: {
        "Authorization": 'token ' + token
      }
    });
  }

}
