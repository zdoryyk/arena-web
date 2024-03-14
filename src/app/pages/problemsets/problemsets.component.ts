import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SubmissionCardComponent } from '../../components/submission-card/submission-card.component';

@Component({
  selector: 'app-problemsets',
  standalone: true,
  imports: [RouterModule,SubmissionCardComponent],
  templateUrl: './problemsets.component.html',
  styleUrl: './problemsets.component.css'
})
export class ProblemsetsComponent{

  
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
