import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { Submission } from '../interfaces/submission';


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

  getProblemsetByUserProblemset(id: string): Observable<any> {
    return this.http.get<any>(`${environment.api_url}/user-problemsets/${id}/problemset`, {
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

  getSubmissionTasks(submissionId: string): Observable<any> {
    var routePath = environment.api_url + "/submissions/" + submissionId + "/tasks";
    return this.http.get<any>(routePath, {
      headers: {
        "Authorization": 'token ' + localStorage.getItem("arena-token")
      }
    });
  }

  getSubmissionById(submissionId: string): Observable<any> {
    var routePath = environment.api_url + "/submissions/" + submissionId;
    return this.http.get<any>(routePath, {
      headers: {
        "Authorization": 'token ' + localStorage.getItem("arena-token")
      }
    });
  }

  async getLimitedSubmissionsByUserProblemsetId(limit: number, problemsetId: string): Promise<any> {
    const submissionsData = await firstValueFrom(this.getUserSubmissionByProblemset(problemsetId));
    const actualLimit = Math.min(submissionsData.data.length, limit);
    const limitedSubmissions = submissionsData.data.slice(0, actualLimit);
    
    return limitedSubmissions; 
}

  trimTitleFromLastYearOrColon(title: string): string {
    const lastYearMatch = title.match(/\d{4}(?!.*\d{4})/); // Ищем последний год
    const lastYearIndex = lastYearMatch ? lastYearMatch.index + 4 : -1; // +4, чтобы перейти за год
  
    const lastColonIndex = title.lastIndexOf(":");
  
    let startIndex = Math.max(lastYearIndex, lastColonIndex);
  
    if (title[startIndex] === " " || title[startIndex] === ":") {
      startIndex++;
    }
  
    return title.substring(startIndex).trim();
  }

} 
