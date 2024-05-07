import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [RouterModule, DatePipe, CommonModule,MatIconModule,HttpClientModule],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.scss'
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
    private themeService: ThemeService, 
    private renderer: Renderer2
  ){
    this.matIconRegistery.addSvgIcon(
      'detail',
      this.domSanitizer
      .bypassSecurityTrustResourceUrl('../assets/icons/detail.svg'),
    )    
  }


  async ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.renderer.removeClass(document.body, 'light-theme');
      this.renderer.removeClass(document.body, 'dark-theme');
      this.renderer.addClass(document.body, theme);
    });
  }


  navigateToDetail(): void {
    this.router.navigate(['/admin-course', this.id]);
  }

}
