import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CourseModel } from '../../../interfaces/interfaces';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class NewCourseServiceService {
  platformId: Object;

  
  constructor(private http: HttpClient,@Inject(PLATFORM_ID) platformId: Object) {
    this.platformId = platformId;
   }

  addNewCourse(course: CourseModel): Observable<any> {
    if(!isPlatformBrowser(this.platformId)){
      return;
    }
    var routePath = environment.api_url + "/courses";  
    return this.http.post(routePath, course, {
        headers: {
            "Authorization": 'token ' + localStorage.getItem("arena-token"),
            "Content-Type": "application/vnd.api+json",
            "Accept": "application/vnd.api+json"
        }
      });
  }
}
