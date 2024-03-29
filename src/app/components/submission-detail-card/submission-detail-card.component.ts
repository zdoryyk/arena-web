import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-submission-detail-card',
  standalone: true,
  imports: [RouterModule, DatePipe, CommonModule],
  templateUrl: './submission-detail-card.component.html',
  styleUrl: './submission-detail-card.component.scss'
})
export class SubmissionDetailCardComponent {

  @Input() id: string;
  @Input() title: string;
  @Input() lastEvaluation: number;
  @Input() maxProblemsetScore: number;
  @Input() lastSubmitDate: Date;
  @Input() completeStatus: Map<string, string>;


  ngOnInit(): void {
  }

}
