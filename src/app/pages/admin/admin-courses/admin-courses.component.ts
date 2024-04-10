import { Component, OnInit, TransferState, makeStateKey } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {  RouterModule } from '@angular/router';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer} from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { NewCourseComponent } from '../../../components/dialogs/new-course/new-course.component';
import { Subscription } from 'rxjs';
import { CourseManagerService } from '../../../services/course-manager.service';
import { Course } from '../../../interfaces/course';
import { Problemset } from '../../../interfaces/problemset';
import { CourseCardComponent } from '../../../components/course-card/course-card.component';
import { ProblemsetCardComponent } from '../../../components/problemset-card/problemset-card.component';


@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [RouterModule, DatePipe, CommonModule,MatIconModule,HttpClientModule,CourseCardComponent,ProblemsetCardComponent],
  templateUrl: './admin-courses.component.html',
  styleUrl: './admin-courses.component.scss'
})
export class AdminCoursesComponent implements OnInit {

  loading: boolean = true;
  coursesSubscription: Subscription = new Subscription;
  rolesSubscription: Subscription = new Subscription;
  userSubscription: Subscription = new Subscription;
  courses: Course[] = [];
  archivedCourses: Course[] = [];
  problemsets: Problemset[] = [];
  coursesStatus: string = "";
  archivedCoursesStatus: string = "";
  coursesWithRole: string[] = [];
  isLecturer: boolean = false;
  userId: string = "";
  totalSubmissions = 0;
  totalGroups = 0;

  constructor(
    private matIconRegistery: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public dialog: MatDialog,
    private transferState: TransferState,
    private coursesManagerService: CourseManagerService,
  ){
    this.matIconRegistery.addSvgIcon(
      'book',
      this.domSanitizer
      .bypassSecurityTrustResourceUrl('../assets/icons/search-book.svg'),
    )
    this.matIconRegistery.addSvgIcon(
      'users',
      this.domSanitizer
      .bypassSecurityTrustResourceUrl('../assets/icons/groups.svg'),
    )
    this.matIconRegistery.addSvgIcon(
      'hat',
      this.domSanitizer
      .bypassSecurityTrustResourceUrl('../assets/icons/graduation-hat.svg'),
    )
    this.matIconRegistery.addSvgIcon(
      'button',
      this.domSanitizer
      .bypassSecurityTrustResourceUrl('../assets/icons/add-square.svg'),
    )
  }
  
   ngOnInit(): void {
    if(this.transferState.hasKey(makeStateKey('problemsets'))){
      this.courses = this.transferState.get(makeStateKey('activeCourses'),[]);
      this.archivedCourses =  this.transferState.get(makeStateKey('archievedCourses'),[]);
      this.totalGroups = this.transferState.get(makeStateKey('totalGroups'),0);
      this.totalSubmissions = this.transferState.get(makeStateKey('totalSubmissions'),0);
      this.problemsets = this.transferState.get<Problemset[]>(makeStateKey('problemsets'),[]);

    }else{
      this.initializeData();
    } 
  }


  async initializeData(){
    (async () => {
      try {
        const { courses, archivedCourses, isLecturer,totalSubmissions,totalGroups} = await this.coursesManagerService.initializeUserData();
        this.courses = courses;
        this.archivedCourses = archivedCourses;
        this.isLecturer = isLecturer;
        this.totalSubmissions = totalSubmissions;
        this.totalGroups = totalGroups;
        this.problemsets = await this.coursesManagerService.getAllProblemsets(courses);
      } catch (error) {
        console.error('Error initializing data', error);
      } finally {
        
        this.loading = false;
        this.transferState.set<any>(makeStateKey('activeCourses'),this.courses);
        this.transferState.set<any>(makeStateKey('archievedCourses'),this.archivedCourses);
        this.transferState.set<number>(makeStateKey('totalSubmissions'),this.totalSubmissions);
        this.transferState.set<number>(makeStateKey('totalGroups'),this.totalGroups);
        this.transferState.set<Problemset[]>(makeStateKey('problemsets'),this.problemsets);
      }
    })();
  }
  


  openNewCourseDialog() {
    const dialogRef = this.dialog.open(NewCourseComponent, {
      data: {
        courses: this.courses
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.courses.push(result.data);
      }
    });
  }

  


}
