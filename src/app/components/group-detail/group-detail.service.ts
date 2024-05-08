import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupDetailService {

  constructor(private http: HttpClient) { }

  getGroup(groupId: string): Observable<any> {
    var routePath = 'environment.api_url + "/groups/" + groupId';
    return this.http.get<any>(routePath, {
      headers: {
          "Authorization": 'token ' + localStorage.getItem("token")
      }
    });
  }

  getUsers(): Observable<any> {
    var routePath = environment.api_url +  "/users";
    return this.http.get<any>(routePath, {
      headers: {
          "Authorization": 'token ' + localStorage.getItem("token")
      }
    });
  }
}
