import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Submission } from '../../interfaces/interfaces';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-submission-card',
  standalone: true,
  imports: [RouterModule, DatePipe, CommonModule],
  templateUrl: './submission-card.component.html',
  styleUrl: './submission-card.component.scss',
})
export class SubmissionCardComponent implements Submission, OnInit {
  @Input() id: string;
  @Input() title: string;
  @Input() totalSubmissions: number;
  @Input() lastEvaluation: number;
  @Input() maxProblemsetScore: number;
  @Input() lastSubmitDate: Date;
  @Input() completeStatus: Map<string, string>;
  @Input() isActive: boolean;


  ngOnInit(): void {
  }

  formatEvaluationScore(score: number): string {
    const roundedScore = score.toFixed(1);
    return roundedScore.endsWith('.0') ? Math.floor(score).toString() : roundedScore;
  }

}
