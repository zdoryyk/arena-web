import { Component, OnInit, TransferState, makeStateKey } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { SubmissionCardComponent } from '../../components/submission-card/submission-card.component';
import { AuthService } from '../../services/auth.service';
import { UserData } from '../../interfaces/user';
import { ProblemsetManagerService } from '../../services/problemset-manager.service';
import { ProblemsetExtra } from '../../interfaces/problemset';
import { ProfileMangerService } from '../../services/profile-manger.service';

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
  problemsets: ProblemsetExtra[] = [];
  chartData: Map<string, any[]> = new Map<string,any[]>

  constructor
  (
    private profileManager: ProfileMangerService,
    private problemsetManager: ProblemsetManagerService,
    private transferState: TransferState,
    private authService: AuthService
  ){

  }
  
  async ngOnInit() {
    await this.loadUserData();
    if(this.transferState.hasKey(makeStateKey('problemsetsCards'))){
      this.problemsets = this.transferState.get(makeStateKey('problemsetsCards'),null);
    }else{
      this.problemsets = await this.problemsetManager.loadUserProblemsets();
    }
    await this.getLastSubmissionsByActiveProblemsets();
    this.setCharts();
    this.latestSubmissions = await this.profileManager.getSubmissionsByLimit(10);
  }


  async getLastSubmissionsByActiveProblemsets() {
    for (const problemset of this.problemsets) {
        if (problemset.isActive) {
            let submissions = await this.problemsetManager.getProblemsetLastSubmissionsByLimitById(8, problemset.id);
            submissions = this.roundSubmissionDates(submissions);
            this.chartData.set(problemset.title, submissions.reverse());
        }
    }
}


setCharts() {
  const datasets = [];
  let time = [];
  for (let [key, submissions] of this.chartData.entries()) {
    const data = submissions.map(submission => submission.score);
    time = submissions.map(submission => submission['date-evaluated']);
    console.log('time,',time);
    let color = this.getRandomColor();

    const newDataset = {
      label: key, 
      data: data,
      fill: false,
      borderColor: color,
      pointBackgroundColor: color, 
    };
    datasets.push(newDataset);
  }

  this.lineData = {
    labels: time, 
    datasets: datasets,
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


  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  private async loadUserData() {
    this.user = await this.authService.checkIsUserInStorage();
  }


  roundSubmissionDates(submissions) {
    return submissions.map(submission => {
      const date = new Date(submission['date-evaluated']);
      date.setMinutes(0, 0, 0);
      submission['date-evaluated'] = date.toLocaleString('en-US', {
        timeZone: 'Europe/Bratislava',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });      
      return submission;
    });
  }
}
