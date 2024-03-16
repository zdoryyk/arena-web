import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AdminDashboardCardComponent } from '../../../components/admin-dashboard-card/admin-dashboard-card.component';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { CourseModel, CourseModelGet, GroupPaginationModel } from '../../../interfaces/interfaces';
import { NewProblemsetComponent } from '../../../components/dialogs/new-problemset/new-problemset.component';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmDialogComponent } from '../../../components/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-course',
  standalone: true,
  imports: [RouterModule, DatePipe, CommonModule,AdminDashboardCardComponent,MatIconModule,HttpClientModule,PaginatorModule,],
  providers:[],
  templateUrl: './admin-course.component.html',
  styleUrl: './admin-course.component.css'
})
export class AdminCourseComponent implements OnInit{
  loading = false;
  first: number = 0;
  
  course: CourseModelGet = {
    id: "",
    name: "",
    archived: false,
    description: "",
    groups: [],
    problemsets: []
  };

  groupes: GroupPaginationModel[] = [
    { name: 'A1', submissions: 15 },
    { name: 'A2', submissions: 25 },
    { name: 'A3', submissions: 30 },
    { name: 'A4', submissions: 20 },
    { name: 'A5', submissions: 18 },
    { name: 'A6', submissions: 22 },
    { name: 'A7', submissions: 27 },
    { name: 'A8', submissions: 13 },
    { name: 'A9', submissions: 9 },
    { name: 'A10', submissions: 14 },
    { name: 'A11', submissions: 17 },
    { name: 'A12', submissions: 11 },
    { name: 'A13', submissions: 12 },
    { name: 'A14', submissions: 16 },
  ];

  paginatedGroups: GroupPaginationModel[] = [];

  constructor(
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
    this.updatePaginatedGroups(0,4);
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

   onPageChange(event: any) {
    this.first = event.first;
    this.updatePaginatedGroups(event.first, event.rows);

  }

  private updatePaginatedGroups(startIndex: number, pageSize: number) {
    this.paginatedGroups = this.groupes.slice(startIndex, startIndex + pageSize);
  }

  

}
