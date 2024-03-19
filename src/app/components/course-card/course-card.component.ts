import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [RouterModule, DatePipe, CommonModule,MatIconModule,HttpClientModule],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css'
})
export class CourseCardComponent implements OnInit  {

  @Input() id: string;
  @Input() title: string;
  @Input() groups?: number;
  @Input() problemsets?: number;
  @Input() isArchieved?: boolean;

  constructor(
    private matIconRegistery: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ){
    
  }


  ngOnInit(): void {
    
  }


  navigateToDetail(): void {
    console.log(this.id);
    this.router.navigate(['/admin-course', this.id]);
  }

}
