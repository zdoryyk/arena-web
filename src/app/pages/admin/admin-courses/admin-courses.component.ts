import { Component, OnInit, Renderer2, TransferState, makeStateKey } from '@angular/core';
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
import { SkeletonModule } from 'primeng/skeleton';
import { ThemeService } from '../../../services/theme.service';
import { SummaryCardsComponent } from '../../../components/summary-cards/summary-cards.component';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [RouterModule, DatePipe, CommonModule,MatIconModule,HttpClientModule,CourseCardComponent,ProblemsetCardComponent,SkeletonModule,SummaryCardsComponent],
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
    private authService: AuthService,
    public dialog: MatDialog,
    private transferState: TransferState,
    private coursesManagerService: CourseManagerService,
    private themeService: ThemeService, 
    private renderer: Renderer2
  ){
  }
  
   ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.renderer.removeClass(document.body, 'light-theme');
      this.renderer.removeClass(document.body, 'dark-theme');
      this.renderer.addClass(document.body, theme);
    });
    if(this.transferState.hasKey(makeStateKey('problemsets'))){
      this.courses = this.transferState.get(makeStateKey('activeCourses'),[]);
      this.archivedCourses =  this.transferState.get(makeStateKey('archievedCourses'),[]);
      this.totalGroups = this.transferState.get(makeStateKey('totalGroups'),0);
      this.totalSubmissions = this.transferState.get(makeStateKey('totalSubmissions'),0);
      this.problemsets = this.transferState.get<Problemset[]>(makeStateKey('problemsets'),[]);
      this.loading = false;
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
        this.transferState.set<any>(makeStateKey('activeCourses'),this.courses);
        this.transferState.set<any>(makeStateKey('archievedCourses'),this.archivedCourses);
        this.transferState.set<number>(makeStateKey('totalSubmissions'),this.totalSubmissions);
        this.transferState.set<number>(makeStateKey('totalGroups'),this.totalGroups);
        this.transferState.set<Problemset[]>(makeStateKey('problemsets'),this.problemsets);
        this.loading = false;
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

  checkToken() {
    this.authService.checkToken().subscribe(
      response => {
        console.log('Token is valid:', response);
        // Handle response here
      },
      error => {
        console.error('Error checking token:', error);
        // Handle error here
      }
    );
  }

  

  toggleTheme(){
    this.themeService.toggleTheme()
  }
}
