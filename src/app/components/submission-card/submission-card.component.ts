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
  @Input() title: string;
  @Input() totalSubmissions: number;
  @Input() lastEvaluation: number;
  @Input() maxProblemsetScore: number;
  @Input() lastSubmitDate: Date;
  @Input() completeStatus: Map<string, string>;
  @Input() isActive: boolean;


  ngOnInit(): void {
    console.log(this.completeStatus.entries());
  }

    submissionData = {
    title: 'PROBLEMS TO SOLVE',
    totalSubmissions: 10,
    lastEvaluation: 0,
    lastSubmitDate: new Date('2022-03-01T18:02:00'),
    completeStatus: new Map<string, string>([
      ['warning','Task Incompleted'],
    ])
  };
}
