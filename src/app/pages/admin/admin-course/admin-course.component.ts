import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { GroupPaginationModel, UserSubmission } from '../../../interfaces/interfaces';
import { NewProblemsetComponent } from '../../../components/dialogs/new-problemset/new-problemset.component';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmDialogComponent } from '../../../components/dialogs/confirm-dialog/confirm-dialog.component';
import { ChartModule } from 'primeng/chart';
import { GroupDetailComponent } from '../../../components/group-detail/group-detail.component';
import { Course } from '../../../interfaces/course';
import { Subscription } from 'rxjs';
import { CourseDetailService } from '../../../services/course-detail.service';
import { Group, GroupResponse } from '../../../interfaces/group';
import { ProblemsetData } from '../../../interfaces/problemset';
import { CourseManagerService } from '../../../services/course-manager.service';
import { AuthService } from '../../../services/auth.service';
import { UserData } from '../../../interfaces/user';

@Component({
  selector: 'app-admin-course',
  standalone: true,
  imports: [RouterModule, DatePipe, CommonModule,MatIconModule,HttpClientModule,PaginatorModule, ChartModule, GroupDetailComponent],
  providers:[],
  templateUrl: './admin-course.component.html',
  styleUrl: './admin-course.component.scss'
})
export class AdminCourseComponent implements OnInit{

  course: Course;
  groups: Group[] = [];
  problemsets: ProblemsetData[] = [];
  loading = true;
  first: number = 0;
  rows: number = 4;
  lineData: any;
  lineOptions: any;
  linePlugins: any;
  private routeSub: Subscription = new Subscription;
  private courseSubscription: Subscription = new Subscription;
  private courseGroupsSubscription: Subscription = new Subscription;
  private courseProblemsetsSubscription: Subscription = new Subscription;
  private userSubscription: Subscription = new Subscription;
  private problemsetStatSubscription: Subscription = new Subscription;
  user: UserData;


  constructor(
    private authService: AuthService,
    private courseMagenerService: CourseManagerService,
    private activeRoute: ActivatedRoute,
    private matIconRegistery: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public dialog: MatDialog,
  ){
    this.matIconRegistery.addSvgIcon(
      'add_problemset',
      this.domSanitizer
      .bypassSecurityTrustResourceUrl('../assets/icons/add_problemset.svg'),
    )
  }


  async ngOnInit() {
    
    await this.loadUserData();
    this.course = {
      type: '',
      id: '', 
      attributes: {
        title: '',
        description: '',
        archived: false,
      },
      relationships: {
        problemsets: {
          data: [], 
        },
        groups: {
          data: [], 
        },
      },
      links: {
        self: '', 
      },
    };
    this.setChart();
    this.course.id = this.activeRoute.snapshot.paramMap.get('id');
    this.courseSubscription = this.courseMagenerService.getCourseDetailsWithExtras(this.course.id).subscribe({
      next: ({ course, problemsets, groups }) => {
        this.course = course.data;
        this.problemsets = problemsets.data;
        this.groups = this.sortLecturesGroups(groups.data);
        this.loading = false;  
      },
      error: (error) => {
        console.error('Error fetching course details with extras', error);
        this.loading = false; 
      }
    });
  }



  sortLecturesGroups(groups: Group[]): Group[] {
    const lecturesGroupIds = this.user.relationships['lecturers-groups'].data.map(group => group.id);
    let filteredGroups = groups.filter(group => lecturesGroupIds.includes(group.id));
    let sortedGroups = filteredGroups.sort((a, b) => a.id.localeCompare(b.id));
    return sortedGroups;
  }
  


  setChart(){
    this.lineData = {
      labels: [
        '00:00',
        '01:00',
        '02:00',
        '03:00',
        '04:00',
        '05:00',
        '06:00',
        '07:00',
        '08:00',
      ],
      datasets: [
        {
          label: 'TOP SECRET',
          data: [0, 39, 55, 81, 58, 75, 40, 9, 74],
          fill: false,
          borderColor: '#F87C3C',
          pointBackgroundColor: '#F87C3C',
        },
      ],
    };

    this.lineOptions = {
      plugins: {
        legend: {
          align: 'end',
          labels: {
            usePointStyle: true,
            pointStyleWidth: 10,
          },
        },
      },
    };
  }

  openNewProblemsetDialog() {
    const dialogWidth = window.innerWidth < 768 ? '75%' : '55%'; 
    var _popup = this.dialog.open(NewProblemsetComponent, {
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '500ms',
      width: dialogWidth,
      data: {
        title: 'Title'
      }
    });
  
    _popup.afterClosed().subscribe(item => {
      console.log(item);
    });
  }
  

  openConfirmationDialog() {
  var _popup =  this.dialog.open(ConfirmDialogComponent,{
    enterAnimationDuration: '1000ms',
    exitAnimationDuration:'500ms',
    width: '40%',
    data: {
      title: 'Title'
    }
    })

    _popup.afterClosed().subscribe(item => {
    console.log(item);
    })
  }

  private async loadUserData() {
    this.user = await this.authService.checkIsUserInStorage();
  }

  ngOnDestroy(): void {
    if (this.courseSubscription) {
      this.courseSubscription.unsubscribe();
    }
  }

}
