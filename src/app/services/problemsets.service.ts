import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProblemsetsService {

  constructor(private http: HttpClient) { }

  getProblemsets(): Observable<any> {
    return this.http.get<any>( environment.api_url + "/problemsets", {
      headers: {
        "Authorization": 'token ' + localStorage.getItem("arena-token")
      }
    });
  }

  getProblemsetDetailById(id: string): Observable<any> {
    return this.http.get<any>( environment.api_url + "/problemsets/" + id, {
      headers: {
        "Authorization": 'token ' + localStorage.getItem("arena-token")
      }
    });
  }

  getUserProblemsets(): Observable<any> {
    return this.http.get<any>( environment.api_url + "/user-problemsets", {
      headers: {
        "Authorization": 'token ' + localStorage.getItem("arena-token")
      }
    });
  }

  getProblemsetsByUserId(id: string): Observable<any> {
    return this.http.get<any>( environment.api_url + "/users/" + id + '/problemsets' , {
      headers: {
        "Authorization": 'token ' + localStorage.getItem("arena-token")
      }
    });
  }

  getUserProblemsetsByUserId(id: string): Observable<any> {
    return this.http.get<any>( environment.api_url + "/users/" + id + '/user-problemsets' , {
      headers: {
        "Authorization": 'token ' + localStorage.getItem("arena-token")
      }
    });
  }

  getUserSubmissionByProblemset(id: string): Observable<any> {
    return this.http.get<any>(`${environment.api_url}/user-problemsets/${id}/submissions`, {
      headers: {
        "Authorization": `token ${localStorage.getItem("arena-token")}`
      }
    });
  }

  getProblemSetDetailsByProblemsetId(id: string): Observable<any> {
    return this.http.get<any>(`${environment.api_url}/problemsets/${id}`, {
      headers: {
        "Authorization": `token ${localStorage.getItem("arena-token")}`
      }
    });
  }
}
