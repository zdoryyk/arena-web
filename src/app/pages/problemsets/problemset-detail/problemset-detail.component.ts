import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { TestGroupComponent } from '../../../components/test-group/test-group.component';
import { TestCaseComponent } from '../../../components/test-case/test-case.component';
import { AuthService } from '../../../services/auth.service';
import { User, UserData, UserProblemSetData } from '../../../interfaces/user';
import { ProblemsetsService } from '../../../services/problemsets.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { ProblemsetManagerService } from '../../../services/problemset-manager.service';
import { NestedTask, Submission, TaskData } from '../../../interfaces/submission';
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
  submissionId: string; 
  submissionData: any;
  problemsetData: any;
  submissionTasks: Submission[] = [];
  submissionsBefore: any[] = [];
  routePaths: string[] = [];
  structureChecks: Submission[] = [];
  suites: Map<TaskData, TaskData[]> = new Map();
  suitesArray: any[] = [];
  user: UserData;

  tasks: NestedTask[];

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
    await this.getSubmissionHeadData();
    await this.getTasksWithModuleLabel(this.submissionId);
    await this.getSubmissionsScoresBeforeAndReloadChart();
  }


  async getTasksWithModuleLabel(id: string) {
    let taskData = await firstValueFrom(this.problemsetService.getSubmissionTasks(id));
    let nestedTasks = this.problemsetManager.nestTasks(taskData.data);
    this.labelModules(nestedTasks);  
    this.tasks = nestedTasks;
    console.log(this.tasks);
    
  }

  convertMapToArray() {
    this.suites.forEach((submissions, taskData) => {
      this.suitesArray.push({
        order: taskData.iterationNumber,
        title: taskData.attributes.title, 
        score: taskData.attributes.score,
        description: taskData.attributes.document.description,
        maxScore: taskData.attributes['max-score'],
        isParentExist: taskData.relationships['parent-task'].data != null,
        isPassed: taskData.attributes.passed,
        isStrict: taskData.attributes.strict,
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
          barPercentage: 0.5, 
          categoryPercentage: 0.8, 
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
    this.submissionData.attributes.score = this.formatEvaluationScore(this.submissionData.attributes.score);
    await this.loadUserData();
    let userProblemsetId = this.submissionData.relationships['user-problemset'].data.id;
    let problemsetData = await firstValueFrom(this.problemsetService.getProblemsetByUserProblemset(userProblemsetId));
    this.problemsetData = problemsetData.data;
    this.problemsetData.attributes.title = this.problemsetService.trimTitleFromLastYearOrColon(this.problemsetData.attributes.title);
  }    

  private async loadUserData() {
    let userProblemsetId = this.submissionData.relationships['user-problemset'].data.id; 
    let userProblemsetData = await firstValueFrom(this.problemsetService.getConcreteUserProblemset(userProblemsetId));
    let userId = userProblemsetData.data.relationships.user.data.id;
    let userData = await firstValueFrom(this.problemsetService.getConcreteUser(userId));
    this.user = userData.data;
  }

  routeToSubmissionList() {
    const problemsetId = this.submissionData.relationships['user-problemset'].data.id;
    this.router.navigate(['/problemset-submissions', problemsetId]);
  }

  setCharts(){

  const minYValue = 20;

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
        min: 0,
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

  isModule(task: NestedTask): boolean {
    if (task.attributes.document.type !== 'suite') {
        return false;
    }
    if (task.children.length === 0) {
        return true;
    }
    for (const child of task.children) {
        if (!this.isModule(child)) {
            return false;
        }
    }
    return true;
  }

  labelModules(tasks: NestedTask[]): void {
    tasks.forEach(task => {
      if (task.children && task.children.length > 0) {
        this.labelModules(task.children);
      }
      task.isModule = this.checkIfModule(task);
    });
  }
  

  checkIfModule(task: NestedTask): boolean {
    // Check if the task is a suite and has no parent
    const isSuite = task.attributes.document.type === 'suite';
    const hasNoParent = task.relationships['parent-task'].data === null;
  
    // It must have at least one child
    const hasChildren = task.children && task.children.length > 0;
  
    return isSuite && hasChildren && hasNoParent;
  }
  

  formatEvaluationScore(score: number): string {
    const roundedScore = score.toFixed(1);
    return roundedScore.endsWith('.0') ? Math.floor(score).toString() : roundedScore;
  }

}
