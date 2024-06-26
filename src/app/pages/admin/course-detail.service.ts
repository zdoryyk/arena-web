import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GroupResponse } from '../../interfaces/group';
import { ProblemsetsResponse } from '../../interfaces/problemset';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class CourseDetailService {

  constructor(private http: HttpClient) { }

  getCourse(courseId: string): Observable<any> {
    var routePath = environment.api_url + "/courses/" + courseId;
    return this.http.get<any>(routePath, {
      headers: {
          "Authorization": 'token ' + localStorage.getItem("arena-token")
      }
    });
  }

  getGroup(groupId: string): Observable<any> {
    var routePath = environment.api_url + "/groups/" + groupId;

    return this.http.get<any>(routePath, {
      headers: {
          "Authorization": 'token ' + localStorage.getItem("arena-token")
      }
    });
  }

  getGroups(courseId: string): Observable<GroupResponse> {
    const routePath = environment.api_url + "/courses/" + courseId + "/groups/";
    return this.http.get<GroupResponse>(routePath, {
      headers: {
        "Authorization": 'token ' + localStorage.getItem("arena-token")
      }
    });
  }

  getCourseProblemsets(courseId: string): Observable<ProblemsetsResponse> {
    const routePath = `${environment.api_url}/courses/${courseId}/problemsets`;
    return this.http.get<ProblemsetsResponse>(routePath, {
      headers: new HttpHeaders({
        "Authorization": `token ${localStorage.getItem("arena-token")}`
      })
    });
  }

  getUser(): Observable<any> {
    var routePath = environment.api_url + "/users/me";
    return this.http.get<any>(routePath, {
      headers: {
          "Authorization": 'token ' + localStorage.getItem("arena-token")
      }

    });
  }

  getProblemsetStat(problemsetId: any): Observable<any> {
    var routePath = environment.api_url + "/problemsets/" + problemsetId + "/stat";
    return this.http.get<any>(routePath, {
      headers: {
          "Authorization": 'token ' + localStorage.getItem("arena-token")
      }
    });
  }

  getCourseProblemset(courseId: string): Observable<any> {
    var routePath = environment.api_url + "/courses/" + courseId + "/problemsets";
    return this.http.get<any>(routePath, {
      headers: {
          "Authorization": 'token ' + localStorage.getItem("arena-token")
      }
    });
  }

  getUserById(id: any): Observable<User> {
    const routePath = `${environment.api_url}/users/${id}`;
    return this.http.get<User>(routePath, {
      headers: {
        "Authorization": `token ${localStorage.getItem("arena-token")}`,
      },
    });
  }


  getLatestSubmissions(): Observable<any> {
    var routePath = environment.api_url + "/submissions/";
    return this.http.get<any>(routePath, {
      headers: {
        "Authorization": 'token ' + localStorage.getItem("arena-token")
      }
    });
  }

  getLatestSubmissionById(id: any): Observable<any> {
    var routePath = environment.api_url + "/submissions/" + id;
    return this.http.get<any>(routePath, {
      headers: {
        "Authorization": 'token ' + localStorage.getItem("arena-token")
      }
    });
  }

}
