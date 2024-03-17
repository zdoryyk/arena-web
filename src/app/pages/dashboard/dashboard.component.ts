import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { SubmissionCardComponent } from '../../components/submission-card/submission-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, ChartModule,SubmissionCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  lineData: any;
  lineOptions: any;
  linePlugins: any;
  submissionData = {
    title: 'PROBLEMS TO SOLVE',
    totalSubmissions: 10,
    lastEvaluation: 0,
    lastSubmitDate: new Date('2022-03-01T18:02:00'),
    completeStatus: new Map<string, string>([
      ['warning','Task Incompleted'],
    ])
  };


  ngOnInit(): void {
    this.lineData = {
      labels: [
        '00:00',
        '01:00',
        '02:00',
        '03:00',
        '04:00',
        '05:00',
        '06:00',
        '07:00',
        '08:00',
      ],
      datasets: [
        {
          label: 'TOP SECRET',
          data: [0, 39, 55, 81, 58, 75, 40, 9, 74],
          fill: false,
          borderColor: '#F87C3C',
          pointBackgroundColor: '#F87C3C',
        },
        {
          label: 'PROB TO SOLVE',
          data: [0, 0, 0, 40, 46, 0, 0, 56, 80],
          fill: false,
          borderColor: '#E0544C',
          pointBackgroundColor: '#E0544C',
        },
      ],
    };

    this.lineOptions = {
      plugins: {
        legend: {
          align: 'end',
          labels: {
            usePointStyle: true,
            pointStyleWidth: 10,
          },
        },
      },
    };
  }
}
