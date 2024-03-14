import { Component, Input, OnInit } from '@angular/core';
import { AdminCourseCard, AdminProblemsetCard } from '../../interfaces/interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard-card',
  standalone: true,
  imports: [RouterModule, DatePipe, CommonModule],
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

  ngOnInit(): void {
    
  }



}
