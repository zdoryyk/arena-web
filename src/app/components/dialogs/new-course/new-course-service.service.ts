import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseModel } from '../../../interfaces/interfaces';


@Injectable({
  providedIn: 'root'
})
export class NewCourseServiceService {

  constructor(private http: HttpClient) { }

  addNewCourse(course: CourseModel): Observable<any> {
    var routePath = 'environment.api_url + "/courses"';
    return this.http.post(routePath, course, {
        headers: {
            "Authorization": 'token ' + localStorage.getItem("token"),
            "Content-Type": "application/vnd.api+json",
            "Accept": "application/vnd.api+json"
        }
      });
  }
}
