import { Component, OnInit, TransferState, makeStateKey } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { SubmissionCardComponent } from '../../components/submission-card/submission-card.component';
import { AuthService } from '../../services/auth.service';
import { UserData } from '../../interfaces/user';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, ChartModule,SubmissionCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  lineData: any;
  lineOptions: any;
  linePlugins: any;
  user: UserData;
  latestSubmissions: any = [];


  submissionData = {
    title: 'PROBLEMS TO SOLVE',
    totalSubmissions: 10,
    lastEvaluation: 0,
    lastSubmitDate: new Date('2022-03-01T18:02:00'),
    completeStatus: new Map<string, string>([
      ['warning','Task Incompleted'],
    ])
  };


  constructor
  (
    private transferState: TransferState,
    private authService: AuthService
  ){

  }

  
  
  async ngOnInit() {
    await this.loadUserData();
    if (this.transferState.hasKey(makeStateKey('latestProblemsets'))) {
      this.latestSubmissions =  this.transferState.get(makeStateKey('latestProblemsets'), []);
      console.log(this.latestSubmissions);
      
    } 

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

  private async loadUserData() {
    this.user = await this.authService.checkIsUserInStorage();
    console.log('user, ', this.user);
  }
}
