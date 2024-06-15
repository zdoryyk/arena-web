import { Component, OnInit, TransferState, makeStateKey } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CourseManagerService } from '../course-manager.service';
import { Course } from '../../../interfaces/course';
import { Problemset } from '../../../interfaces/problemset';
import { CourseCardComponent } from '../../../components/course-card/course-card.component';
import { ProblemsetCardComponent } from '../../../components/problemset-card/problemset-card.component';
import { SkeletonModule } from 'primeng/skeleton';
import { SummaryCardsComponent } from '../../../components/summary-cards/summary-cards.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../core-services/language.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  providers:[HttpClient],
  imports: [RouterModule, DatePipe, CommonModule,MatIconModule,HttpClientModule,CourseCardComponent,ProblemsetCardComponent,SkeletonModule,SummaryCardsComponent,TranslateModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {

  courses: Course[] = [];
  archivedCourses: Course[] = [];
  problemsets: Problemset[] = [];
  loading: boolean = true;
  isLecturer: boolean = false;
  totalSubmissions = 0;
  totalGroups = 0;
  da = Date.now();


  constructor(
    private matIconRegistery: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private coursesManagerService: CourseManagerService,
    private transferState: TransferState,
    private translate: TranslateService,
    private languageService: LanguageService,
  ){
    this.translate.addLangs(['en', 'sk', 'ua','ru']);
    this.translate.setDefaultLang('sk');
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
  }

  ngOnInit(): void {
    this.languageService.lang$.subscribe(lang => {
      this.translate.use(lang);
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
        this.transferState.set<Course[]>(makeStateKey('activeCourses'),this.courses);
        this.transferState.set<Course[]>(makeStateKey('archievedCourses'),this.archivedCourses);
        this.transferState.set<number>(makeStateKey('totalSubmissions'),this.totalSubmissions);
        this.transferState.set<number>(makeStateKey('totalGroups'),this.totalGroups);
        this.transferState.set<Problemset[]>(makeStateKey('problemsets'),this.problemsets);
        this.loading = false;
      }
    })();
  }

}
