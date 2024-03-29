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
import { DatePipe } from '@angular/common';
import { data } from 'jquery';
import { Problemset } from '../../../interfaces/problemset';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-problemset-detail',
  standalone: true,
  imports: [RouterModule, ChartModule, TestGroupComponent, TestCaseComponent,DatePipe],
  templateUrl: './problemset-detail.component.html',
  styleUrl: './problemset-detail.component.scss',
})
export class ProblemsetDetailComponent implements OnInit {

  private _testCaseData = [];
  user: UserData;
  submissionId: string; 
  submissionData: any;
  problemsetData: any;

  get testCaseData() {
    return this._testCaseData
      .map((parentObject, index) => ({
        ...parentObject,
        totalCompleted: this.onGetData('completed', index),
        totalAssessment: this.onGetData('assessment', index),
      }))
      .filter((parentObject) => parentObject.cases.length > 0);
  }

  barData: any;
  barOptions: any;
  barPlugins: any;
  constructor
  (
    private router: Router,
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private problemsetService: ProblemsetsService
  ) {
    this._testCaseData = [
      {
        id: 1,
        title: 'Actions',
        cases: [
          {
            orderedNumber: 1,
            isProcessing: true,
            completed: 7,
            assessment: 7,
            text: 'text',
            isError: false,
          },
          {
            orderedNumber: 2,
            isProcessing: false,
            completed: 0,
            assessment: 2.5,
            text: 'text',
            isError: false,
          },
          {
            orderedNumber: 3,
            isProcessing: true,
            completed: 0,
            assessment: 1.5,
            text: 'text',
            isError: false,
          },
          {
            orderedNumber: 4,
            isProcessing: true,
            completed: 1,
            assessment: 5,
            text: 'text',
            isError: false,
          },
        ],
      },
      {
        id: 2,
        title: 'Behaviours',
        cases: [
          {
            orderedNumber: 5,
            isProcessing: true,
            completed: 2,
            assessment: 4,
            text: 'text',
            isError: true,
          },
          {
            orderedNumber: 6,
            isProcessing: false,
            completed: 0,
            assessment: 1,
            text: 'text',
            isError: false,
          },
          {
            orderedNumber: 7,
            isProcessing: true,
            completed: 4,
            assessment: 4,
            text: 'text',
            isError: false,
          },
        ],
      },
    ];
  }

  async ngOnInit() {
    this.submissionId = this.activeRoute.snapshot.paramMap.get('id');
    this.setCharts();
    await this.loadUserData();
    this.getSubmissionHeadData();
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
    this.router.navigate(['/problemsets-detail', problemsetId]);
  }


  setCharts(){
    this.barData = {
      labels: [1, 2, 3, 4, 5, 6, 7],
      datasets: [
        {
          label: '',
          data: [65, 59, 79, 41, 56, 55, 40],
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

    this.barOptions = {
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
    console.log('user, ', this.user);
  }



  onGetData(field: string, parentIndex: number) {
    if (parentIndex < 0 || parentIndex >= this._testCaseData.length) return;

    const parentObject = this._testCaseData[parentIndex];
    const filteredCases = parentObject.cases.filter(
      (testCase) => !testCase.isError && testCase.isProcessing
    );

    return filteredCases.reduce((sum, testCase) => {
      return sum + testCase[field];
    }, 0);
  }


}
