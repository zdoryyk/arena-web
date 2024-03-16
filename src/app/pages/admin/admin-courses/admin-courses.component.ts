import { Component, OnInit } from '@angular/core';
import { AdminDashboardCardComponent } from '../../../components/admin-dashboard-card/admin-dashboard-card.component';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { NewCourseComponent } from '../../../components/dialogs/new-course/new-course.component';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [RouterModule, DatePipe, CommonModule,AdminDashboardCardComponent,MatIconModule,HttpClientModule],
  templateUrl: './admin-courses.component.html',
  styleUrl: './admin-courses.component.css'
})
export class AdminCoursesComponent implements OnInit {

  courses: any[] = [];

  constructor(
    private matIconRegistery: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public dialog: MatDialog,
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
