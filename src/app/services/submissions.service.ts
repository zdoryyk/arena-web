import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProblemsetsService {

  constructor(private http: HttpClient) {

  }

  getProblemsetDetailById(id: string): Observable<any> {
    return this.http.get<any>( environment.api_url + "/problemsets/" + id, {
      headers: {
        "Authorization": 'token ' + localStorage.getItem("arena-token")
      }
    });
  }

}
