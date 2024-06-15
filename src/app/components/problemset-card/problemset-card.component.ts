import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-problemset-card',
  standalone: true,
  imports: [RouterModule, DatePipe, CommonModule,MatIconModule,HttpClientModule],
  templateUrl: './problemset-card.component.html',
  styleUrl: './problemset-card.component.scss'
})
export class ProblemsetCardComponent {

  @Input() id: string;
  @Input() title: string;
  @Input() courseTitle: string;
  @Input() courseId: string;
  @Input() created: Date;

  constructor(
    private matIconRegistery: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router,
  ){
    this.matIconRegistery.addSvgIcon(
      'detail',
      this.domSanitizer
      .bypassSecurityTrustResourceUrl('../assets/icons/detail.svg'),
    )    
  }
  
  ngOnInit(): void {
    this.title = this.trimTitleFromLastYearOrColon(this.title);
  }

  navigateToDetail(): void {
    console.log(this.id);
    this.router.navigate(['/admin-course', this.courseId]);
  }

  private trimTitleFromLastYearOrColon(title: string): string {
    const lastYearMatch = title.match(/\d{4}(?!.*\d{4})/);
    const lastYearIndex = lastYearMatch ? lastYearMatch.index + 4 : -1;
  
    const lastColonIndex = title.lastIndexOf(":");
  
    let startIndex = Math.max(lastYearIndex, lastColonIndex);
  
    if (title[startIndex] === " " || title[startIndex] === ":") {
      startIndex++;
    }
  
    return title.substring(startIndex).trim();
  }

}
