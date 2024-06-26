import { Component, OnInit, TransferState, makeStateKey } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { SubmissionCardComponent } from '../../components/submission-card/submission-card.component';
import { UserData } from '../../interfaces/user';
import { ProblemsetManagerService } from '../problemsets/problemset-manager.service';
import { ProblemsetExtra } from '../../interfaces/problemset';
import { ProfileMangerService } from '../profile/profile-manger.service';
import { SkeletonModule } from 'primeng/skeleton';
import {MatButtonModule} from '@angular/material/button';
import { TableModule } from 'primeng/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core-services/language.service';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, ChartModule,SubmissionCardComponent,SkeletonModule,MatButtonModule,TableModule, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  areAllProblemsetsDisabled = true;
  lineData: any;
  lineOptions: any;
  linePlugins: any;
  user: UserData;
  latestSubmissions: any = [];
  problemsets: ProblemsetExtra[] = [];
  chartData: Map<string, any[]> = new Map<string,any[]>
  disabledProblemset: ProblemsetExtra;
  cols = ['index','title','score','action']
  loadedProblemsetsData: any = [];
  constructor
  (
    private router: Router,
    private profileManager: ProfileMangerService,
    private problemsetManager: ProblemsetManagerService,
    private transferState: TransferState,
    private authService: AuthService,
    private translate: TranslateService,
    private languageService: LanguageService,

  ){

  }

  async ngOnInit() {
    this.languageService.lang$.subscribe(lang => {
      this.translate.use(lang);
    });
    await this.loadUserData();
    if(this.user.attributes['is-lecturer']){
      this.router.navigate(['/admin-dashboard']);
      return;
    }
    if(this.transferState.hasKey(makeStateKey('problemsetsCards'))){
      this.problemsets = this.transferState.get(makeStateKey('problemsetsCards'),null);
    }else{
      this.problemsets = await this.problemsetManager.loadProblemsets();
    }
    if(this.transferState.hasKey(makeStateKey('latestSubmissions'))){
      this.latestSubmissions = this.transferState.get(makeStateKey('latestSubmissions'),null);
      this.isLoading = false;
    }else{
      this.latestSubmissions = await this.profileManager.getSubmissionsByLimit(10);
      this.transferState.set<any>(makeStateKey('latestSubmissions'),this.latestSubmissions);
    }
    await this.checkProblemsetsForActive();
    if(this.areAllProblemsetsDisabled){
      await this.getLastSubmissionsByDisabledProblemsets();
    }else{
      await this.getLastSubmissionsByActiveProblemsets();
    }
    this.setCharts();
    this.isLoading = false;
  }


  async getLastSubmissionsByDisabledProblemsets() {
    for (const problemset of this.problemsets) {
        if (!problemset.isActive) {
            this.disabledProblemset = problemset;
            let submissions = await this.problemsetManager.getProblemsetLastSubmissionsByLimitById(8, problemset.id);
            submissions = this.roundSubmissionDates(submissions);
            this.chartData.set(problemset.title, submissions.reverse());
            break;
        }
    }
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


  checkProblemsetsForActive(){
    for(const problemset of this.problemsets){
      if(problemset.isActive){
        this.areAllProblemsetsDisabled = false;
      }
    }
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

  navigateToSubmission(id: string){
    this.router.navigate([`/submission/${id}`]);
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

  formatEvaluationScore(score: number): string {
    const roundedScore = score.toFixed(1);
    return roundedScore.endsWith('.0') ? Math.floor(score).toString() : roundedScore;
  }
}
