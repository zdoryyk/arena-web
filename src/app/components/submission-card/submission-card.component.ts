import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Submission } from '../../interfaces/interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { log } from 'console';

@Component({
  selector: 'app-submission-card',
  standalone: true,
  imports: [RouterModule,DatePipe,CommonModule],
  templateUrl: './submission-card.component.html',
  styleUrl: './submission-card.component.css'
})
export class SubmissionCardComponent  implements Submission, OnInit{

  
  @Input() title: string;
  @Input() totalSubmissions: number;
  @Input() lastEvaluation: number;
  @Input() lastSubmitDate: Date;
  @Input() completeStatus: Map<string, string>;
  
  ngOnInit(): void {
    console.log(this.completeStatus.entries());
  }


}
