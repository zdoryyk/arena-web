import { Component, Input, OnInit } from '@angular/core';
import { AdminCourseCard, AdminProblemsetCard } from '../../../interfaces/interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminDashboardCardComponent } from '../../../components/admin-dashboard-card/admin-dashboard-card.component';
import { HttpClient, HttpClientModule, HttpContext, HttpParamsOptions } from '@angular/common/http';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  providers:[HttpClient],
  imports: [RouterModule, DatePipe, CommonModule,AdminDashboardCardComponent,MatIconModule,HttpClientModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  constructor(
    private matIconRegistery: MatIconRegistry,
    private domSanitizer: DomSanitizer,
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
  }
  
  ngOnInit(): void {
    
  }

}
