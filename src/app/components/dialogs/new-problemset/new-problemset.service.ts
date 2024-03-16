import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewProblemsetService {

  constructor(private http: HttpClient) { }

  saveProblemset(): Observable<string>{
    return null;
  }
}
