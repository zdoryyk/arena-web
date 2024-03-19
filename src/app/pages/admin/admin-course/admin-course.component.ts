import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { GroupPaginationModel } from '../../../interfaces/interfaces';
import { NewProblemsetComponent } from '../../../components/dialogs/new-problemset/new-problemset.component';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmDialogComponent } from '../../../components/dialogs/confirm-dialog/confirm-dialog.component';
import { ChartModule } from 'primeng/chart';
import { GroupDetailComponent } from '../../../components/dialogs/group-detail/group-detail.component';
import { Course } from '../../../interfaces/course';
import { Subscription } from 'rxjs';
import { CourseDetailService } from '../../../services/course-detail.service';
import { group, log } from 'console';
import { Group, GroupResponse } from '../../../interfaces/group';

@Component({
  selector: 'app-admin-course',
  standalone: true,
  imports: [RouterModule, DatePipe, CommonModule,MatIconModule,HttpClientModule,PaginatorModule, ChartModule],
  providers:[],
  templateUrl: './admin-course.component.html',
  styleUrl: './admin-course.component.css'
})
export class AdminCourseComponent implements OnInit{

  course: Course;
  groups: Group[] = [];
  paginatedGroups: Group[] = [];
  loading = false;
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
  constructor(
    private courseDetailService: CourseDetailService,
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


  ngOnInit(): void {
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
    this.courseSubscription = this.courseDetailService.getCourse(this.course.id).subscribe(result => {
      this.course.attributes.title = result.data.attributes.title;
      this.course.attributes.archived = result.data.attributes.archived;
      this.course.attributes.description = result.data.attributes.description;
      this.courseDetailService.getGroups(this.course.id).subscribe({
        next: (response) => {
          this.groups = response.data;
          console.log(this.first);
          this.updatePaginatedGroups();
        },
        error: (error) => {
          console.error('Произошла ошибка при получении групп:', error);
        }
      });
    });
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

  test(){
    var _popup =  this.dialog.open(GroupDetailComponent,{
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

  openNewProblemsetDialog() {
  var _popup =  this.dialog.open(NewProblemsetComponent,{
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

    updatePaginatedGroups(): void {
      this.paginatedGroups = this.groups.slice(this.first, this.first + this.rows);
      console.log(this.paginatedGroups);
      
    }
  
    onPageChange(event: any): void {
      this.first = event.first;
      console.log(this.first);
      this.updatePaginatedGroups();
    }
  

}
