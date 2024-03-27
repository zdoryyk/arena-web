import { Injectable } from '@angular/core';
import { CoursesService } from './courses.service';
import { ProblemsetsService } from './problemsets.service';
import { Course } from '../interfaces/course';
import { Problemset } from '../interfaces/problemset';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { CourseDetailService } from './course-detail.service';

@Injectable({
  providedIn: 'root'
})
export class CourseManagerService {

  constructor
  (
    private coursesService: CoursesService,
    private coursesDetailService: CourseDetailService,
    private problemsetsService: ProblemsetsService
   ) { }

  async initializeUserData(): Promise<any> {
    try {
      const user = await this.coursesService.getUser().toPromise();
      const userId = user.data.id;
      const isLecturer = user.data.attributes['is-lecturer'];

      const roles = await this.coursesService.getRoles().toPromise();
      const coursesWithRole = [];
      let hasAnyRole = false;
      roles.data.forEach(role => {
        if (role.attributes.role === 1) {
          hasAnyRole = true;
          coursesWithRole.push(role.relationships.course.data.id);
        }
      });

      if (!hasAnyRole) {
        return { courses: [], archivedCourses: [], isLecturer };
      }

      const courses = await this.coursesService.getUserCourses(userId).toPromise();
      const activeCourses = [];
      const archivedCourses = [];
      let totalSubmissions = 0;
      let totalGroups = 0;
      courses.data.forEach(course => {
        if (coursesWithRole.includes(course.id)) {
          if (course.attributes.archived) {
            archivedCourses.push(course);
          } else {
            activeCourses.push(course);
            totalSubmissions += course.relationships.problemsets.data.length;
            totalGroups += course.relationships.groups.data.length;
          }
        }
      });
      return { courses: activeCourses, archivedCourses, isLecturer,totalSubmissions,totalGroups};
    } catch (error) {
      console.error('Failed to initialize user data', error);
      throw error; 
    }
  }

  getCourseDetailsWithExtras(courseId: string): Observable<any> {
    return this.coursesDetailService.getCourse(courseId).pipe(
      switchMap(course => {
        const problemsets$ = this.coursesDetailService.getCourseProblemsets(courseId);
        const groups$ = this.coursesDetailService.getGroups(courseId);
        return forkJoin([of(course), problemsets$, groups$]);
      }),
      map(([course, problemsets, groups]) => {
        return {
          course,
          problemsets,
          groups
        };
      }),
      catchError(error => {
        console.error('Error fetching course details with extras', error);
        throw error;
      })
    );
  }
  
  
  
  
  async getAllProblemsets(courses: Course[]): Promise<Problemset[]> {
    let allProblemsets: Problemset[] = [];
    for (const course of courses) {
        const courseProblemsets = await Promise.all(
            course.relationships.problemsets.data.map(async (ps) => {
                const problemsetDetail = await this.getProblemsetById(ps.id);
                return problemsetDetail.data; 
            })
        );
        allProblemsets = allProblemsets.concat(courseProblemsets);
    }
    return allProblemsets;
}

  async getProblemsetById(id: string): Promise<any> {
    try {
      const problemsets = await this.problemsetsService.getProblemsetDetailById(id).toPromise();
      return problemsets;
    } catch (error) {
      console.error('Error fetching problemsets', error);
      throw error;
    }
  }
    
}





