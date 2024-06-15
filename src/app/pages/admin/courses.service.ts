import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http: HttpClient) { }

  getUserCourses(userId: any): Observable<any> {
    return this.http.get<any>( environment.api_url + "/users/" + userId + "/courses", {
      headers: {
        "Authorization": 'token ' + localStorage.getItem("arena-token")
      }
    });
  }

  getUser(): Observable<any> {
    return this.http.get<any>( environment.api_url + "/users/me", {
      headers: {
        "Authorization": 'token ' + localStorage.getItem("arena-token")
      }
    });
  }

  getRoles(): Observable<any> {
    return this.http.get<any>( environment.api_url + "/roles", {
      headers: {
        "Authorization": 'token ' + localStorage.getItem("arena-token")
      }
    });
  }



}
