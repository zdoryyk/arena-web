import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-problemset-card',
  standalone: true,
  imports: [RouterModule, DatePipe, CommonModule,MatIconModule,HttpClientModule],
  templateUrl: './problemset-card.component.html',
  styleUrl: './problemset-card.component.css'
})
export class ProblemsetCardComponent {

  @Input() id: string;
  @Input() title: string;
  @Input() groups: number;
  @Input() problemsets?: number;
  @Input() created: Date;

  constructor(
    private matIconRegistery: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ){
    // this.matIconRegistery.addSvgIcon(
    //   'detail',
    //   this.domSanitizer
    //   .bypassSecurityTrustResourceUrl('../assets/icons/detail.svg'),
    // )    
  }
  
  ngOnInit(): void {
    
  }

  navigateToDetail(): void {
    console.log(this.id);
    this.router.navigate(['/admin-course', this.id]);
  }

}
