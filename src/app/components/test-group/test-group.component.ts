import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  isVisible: string = '';
  isCompetedVisible: string = '';

  ngOnInit(): void {
    if (this.totalAssessment > 0) {
      this.isVisible = 'visible';
    }
    if (this.totalAssessment === this.totalCompleted) {
      this.isCompetedVisible = 'hidden';
    }
  }
}
