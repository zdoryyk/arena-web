import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { TestGroupComponent } from '../../../components/test-group/test-group.component';
import { TestCaseComponent } from '../../../components/test-case/test-case.component';
import { AuthService } from '../../../services/auth.service';
import { UserData, UserProblemSetData } from '../../../interfaces/user';
import { ProblemsetsService } from '../../../services/problemsets.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { ProblemsetManagerService } from '../../../services/problemset-manager.service';
import { Submission, TaskData } from '../../../interfaces/submission';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-problemset-detail',
  standalone: true,
  imports: [RouterModule, ChartModule, TestGroupComponent, TestCaseComponent,DatePipe,CommonModule],
  templateUrl: './problemset-detail.component.html',
  styleUrl: './problemset-detail.component.scss',
})
export class ProblemsetDetailComponent implements OnInit {

  private _testCaseData = [];
  user: UserData;
  submissionId: string; 
  submissionData: any;
  problemsetData: any;
  submissionTasks: Submission[] = [];
  submissionsBefore: any[] = [];
  routePaths: string[] = [];
  structureChecks: Submission[] = [];
  suites: Map<TaskData, TaskData[]> = new Map();
  suitesArray: any[] = [];

  // get testCaseData() {
  //   return this._testCaseData
  //     .map((parentObject, index) => ({
  //       ...parentObject,
  //       totalCompleted: this.onGetData('completed', index),
  //       totalAssessment: this.onGetData('assessment', index),
  //     }))
  //     .filter((parentObject) => parentObject.cases.length > 0);
  // }

  barData: any;
  barOptions: any;
  barPlugins: any;
  constructor
  (
    private router: Router,
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private problemsetService: ProblemsetsService,
    private problemsetManager: ProblemsetManagerService,
  ) {
  }

  async ngOnInit() {
    this.submissionId = this.activeRoute.snapshot.paramMap.get('id');
    this.setCharts();
    await this.loadUserData();
    await this.getSubmissionHeadData();
    await this.getSubmissionTasks();
    await this.getSubmissionsScoresBeforeAndReloadChart();
  }


  private async getSubmissionTasks(): Promise<void> {
    const { structureChecks, suites } = await this.problemsetManager.getSortedTasksByTypeAndSuits(this.submissionId);
    this.structureChecks = structureChecks;
    this.suites = suites;
    this.convertMapToArray();
  }

  convertMapToArray() {
    this.suites.forEach((submissions, taskData) => {
      this.suitesArray.push({
        title: taskData.attributes.title, 
        score: taskData.attributes.score,
        description: taskData.attributes.document.description,
        maxScore: taskData.attributes['max-score'],
        submissions: submissions
      });
    });
    
  }


  private async getSubmissionsScoresBeforeAndReloadChart(){
    const id = this.submissionData.relationships['user-problemset']['data']['id'];
    this.submissionsBefore = (await this.problemsetService.getLimitedSubmissionsByUserProblemsetId(7, id));
    this.routePaths = this.submissionsBefore.map(submission => `${environment.base_url}/submission/${submission.id}`);
    this.barData = {
      labels: this.submissionsBefore.map((_, index) => index + 1),
      datasets: [
        {
          label: '',
          data: this.submissionsBefore.map(submission => submission.attributes.score.toFixed(1)),
          barPercentage: 0.6,
          backgroundColor: (color: any) => {
            const highestIndex = this.barData.datasets[0].data.indexOf(
              Math.max(...this.barData.datasets[0].data)
            );
            return color.index === highestIndex ? '#88C4E4' : '#D8E4EC';
          },
        },
      ],
    };
  }

  private async getSubmissionHeadData(){
    let submissionData = await firstValueFrom(this.problemsetService.getSubmissionById(this.submissionId));
    this.submissionData = submissionData.data;
    let userProblemsetId = this.submissionData.relationships['user-problemset'].data.id;
    let problemsetData = await firstValueFrom(this.problemsetService.getProblemsetByUserProblemset(userProblemsetId));
    this.problemsetData = problemsetData.data;
    this.problemsetData.attributes.title = this.problemsetService.trimTitleFromLastYearOrColon( this.problemsetData.attributes.title);
  }    

  routeToSubmissionList() {
    const problemsetId = this.submissionData.relationships['user-problemset'].data.id;
    this.router.navigate(['/problemset-submissions', problemsetId]);
  }


  setCharts(){
    this.barOptions = {
      onClick: (event, elements, chart) => {
        if (elements.length > 0) {
          const firstElementIndex = elements[0].index;
          const urls = this.routePaths;
          const url = urls[firstElementIndex];
          if (url) {
            window.location.href = url;
          }
        }
      },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
          labels: {
            title: {
              color: '#000',
              font: {
                weight: 'bold',
                size: 18,
              },
            },
          },
        },
        tooltip: {
          enabled: false,
        },
      },
      layout: {
        padding: 30,
      },
      scales: {
        y: {
          ticks: {
            callback: function () {
              return '';
            },
          },
          grid: {
            display: false,
            drawOnChartArea: false,
          },
          border: {
            display: false,
          },
        },
        x: {
          ticks: {
            callback: function () {
              return '';
            },
          },
          grid: {
            display: false,
            drawOnChartArea: false,
          },
          border: {
            color: '#000',
          },
        },
      },
    };
    this.barPlugins = [ChartDataLabels];
  }

  private async loadUserData() {
    this.user = await this.authService.checkIsUserInStorage();
  }

}
