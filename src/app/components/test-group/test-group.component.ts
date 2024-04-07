import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-test-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-group.component.html',
  styleUrl: './test-group.component.scss',
})
export class TestGroupComponent implements OnInit {

  @Input() title: string;
  @Input() totalCompleted: number;
  @Input() totalAssessment: number;
  @Input() description: string;
  safeHtml: SafeHtml;
  isVisible: string = '';
  isCompetedVisible: string = '';

  constructor(private cdRef: ChangeDetectorRef,private sanitizer: DomSanitizer){

  }

  ngOnInit(): void {
    if(this.description){
      this.parseDescription(this.description);
    }
    if (this.totalAssessment > 0) {
      this.isVisible = 'visible';
    }
    if (this.totalAssessment === this.totalCompleted) {
      this.isCompetedVisible = 'hidden';
    }
  }

  parseDescription(description: string): string {
    description = description.replace(/`([^`]+)`/g, '<code>$1</code>');
    description = description.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
    description = description.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
    description = description.replace(/\_([^\_]+)\_/g, '<em>$1</em>'); 
    description = description.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a style="color: #8FBE48;text-decoration: none"  href="$2">$1</a>');
    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(description);
    return description;
  }
}
