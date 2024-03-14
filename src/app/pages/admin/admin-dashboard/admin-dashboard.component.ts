import { Component, Input, OnInit } from '@angular/core';
import { AdminCourseCard, AdminProblemsetCard } from '../../../interfaces/interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminDashboardCardComponent } from '../../../components/admin-dashboard-card/admin-dashboard-card.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, DatePipe, CommonModule,AdminDashboardCardComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  
  ngOnInit(): void {
    
  }

}
