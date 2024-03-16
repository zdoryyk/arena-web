import { Component, Input, OnInit } from '@angular/core';
import { AdminCourseCard, AdminProblemsetCard } from '../../interfaces/interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-dashboard-card',
  standalone: true,
  imports: [RouterModule, DatePipe, CommonModule,MatIconModule,HttpClientModule],
  templateUrl: './admin-dashboard-card.component.html',
  styleUrl: './admin-dashboard-card.component.css'
})
export class AdminDashboardCardComponent implements AdminCourseCard,AdminProblemsetCard,OnInit {

  @Input() title: string;
  @Input() course: String;
  @Input() groups: number;
  @Input() problemsets?: number;
  @Input() created: Date;
  @Input() isCourse: boolean;
  @Input() isArchievedCourse: boolean;

  constructor(
    private matIconRegistery: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ){
    // this.matIconRegistery.addSvgIcon(
    //   'detail',
    //   this.domSanitizer
    //   .bypassSecurityTrustResourceUrl('../assets/icons/detail.svg'),
    // )
  }
  
  ngOnInit(): void {
    
  }



}
