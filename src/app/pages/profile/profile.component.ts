import { Component, OnChanges, OnInit, TransferState, makeStateKey } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import {  ExtendedUserProfile, UserData } from '../../interfaces/user';
import { LoginService } from '../login/login.service';
import { AuthService } from '../../services/auth.service';
import { ProfileMangerService } from '../../services/profile-manger.service';



@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AvatarModule, AvatarGroupModule, ChartModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit{
  leftDoughnutData: any;
  rightDoughnutData: any;
  barData: any;
  doughnutOptions: any;
  barOptions: any;
  doughnutPlugins: any;
  barPlugins: any;
  userData: UserData;
  user: ExtendedUserProfile;
  latestProblemsets: any;
  constructor(
    private transferState: TransferState,
    private authService: AuthService,
    private loginService: LoginService,
    private profileManager: ProfileMangerService
  ){}
  

  
  async ngOnInit() {
    this.setCharts();
    await this.loadData();  
    await this.updateChartData();
  }

  private async loadData() {
    if (this.transferState.hasKey(makeStateKey('profileData'))) {
      this.loadProfileDataFromState();
    } else {
      await this.loadUserData();
      await this.loadLatestProblemsets();
    }
  }

  private async loadLatestProblemsets() {
    if (this.transferState.hasKey(makeStateKey('latestProblemsets'))) {
      this.latestProblemsets = this.transferState.get(makeStateKey('latestProblemsets'), []);
    } else {
      await this.fetchAndStoreLatestProblemsets();
    }
  }
  
  private async fetchAndStoreLatestProblemsets() {
    this.latestProblemsets = await this.profileManager.getSubmissionsByLimit(7);
    if (!this.transferState.hasKey(makeStateKey('latestProblemsets'))) {
      this.transferState.set<any>(makeStateKey('latestProblemsets'), this.latestProblemsets);
    }
  }

  private loadProfileDataFromState() {
    this.user = this.transferState.get(makeStateKey('profileData'), null);
    this.loadLatestProblemsets();
  }

  private async loadUserData() {
    this.userData = await this.authService.checkIsUserInStorage();
    let { totalsubmissions, totalScores, maxTotalScores, rate } = await this.profileManager.getSubmissionsAndScores();
    
    this.user = {
        fullName: `${this.userData.attributes['first-name']} ${this.userData.attributes['last-name']}`,
        problemsetsLength: this.userData.relationships['user-problemsets'].data.length,
        submissionsLength: totalsubmissions,
        totalScore: totalScores, 
        maxTotalScore: maxTotalScores,
        latestProblemsets: this.latestProblemsets,
        rate: rate,
        data: this.userData,
    };
    if(!this.transferState.hasKey(makeStateKey('profileData'))){
        this.transferState.set<ExtendedUserProfile>(makeStateKey('profileData'),this.user);
    }
}


  async updateChartData() {
    let submissionsMap = this.latestProblemsets;
    let maxScore = submissionsMap.maxScore;
    let scores = submissionsMap.scores; 
    let lastSubmissionEvaluationInPercents = (scores[0]/maxScore) * 100;
    let remainingPercentage = 100 - lastSubmissionEvaluationInPercents;
    this.barData = {
      labels: ['latest', 2, 3, 4, 5, 6, 7],
      datasets: [
        {
          label: '',
          data: scores,
          backgroundColor: '#1B59F8',
          borderRadius: 50,
          barPercentage: 0.5,
        },
        {
          label: '',
          data: [maxScore, maxScore, maxScore, maxScore, maxScore, maxScore, maxScore],
          backgroundColor: '#F2F7FF',
          borderRadius: 50,
          barPercentage: 0.5,
          hoverBackgroundColor: '#F2F7FF',
        },
      ],
    };
    
    this.leftDoughnutData = {
      id: 'leftDoughnut',
      labels: ['Last Submission'],
      datasets: [
        {
          data: [lastSubmissionEvaluationInPercents, remainingPercentage], // [max: 100, 116 - [1]]
          backgroundColor: ['#A9BEF4', 'transparent'],
          cutout: 115,
          borderWidth: 0,
          borderRadius: [8, 0],
          spacing: -45,
        },
        {
          data: [100],
          backgroundColor: 'transparent',
          cutout: 115,
          borderWidth: 10,
          borderColor: 'rgba(231, 196, 242, 0.4)',
          hoverBorderColor: 'rgba(231, 196, 242, 0.4)',
        },
      ],
    };


    this.rightDoughnutData = {
      id: 'rightDoughnut',
      labels: ['Earned points'],
      datasets: [
        {
          data: [50, 66], // [max: 100, 1016 - [1]]
          backgroundColor: ['#cf93cd', 'transparent'],
          cutout: 115,
          borderWidth: 0,
          borderRadius: [8, 0],
          spacing: -45,
        },
        {
          data: [800],
          backgroundColor: 'transparent',
          cutout: 115,
          borderWidth: 10,
          borderColor: 'rgba(231, 196, 242, 0.4)',
          hoverBorderColor: 'rgba(231, 196, 242, 0.4)',
        },
      ],
    };

  }
  

  setCharts(){
      this.leftDoughnutData = {
        id: 'leftDoughnut',
        labels: ['Last Submission'],
        datasets: [
          {
            data: [99, 17], // [max: 100, 116 - [1]]
            backgroundColor: ['#A9BEF4', 'transparent'],
            cutout: 115,
            borderWidth: 0,
            borderRadius: [8, 0],
            spacing: -45,
          },
          {
            data: [100],
            backgroundColor: 'transparent',
            cutout: 115,
            borderWidth: 10,
            borderColor: 'rgba(231, 196, 242, 0.4)',
            hoverBorderColor: 'rgba(231, 196, 242, 0.4)',
          },
        ],
      };

      this.rightDoughnutData = {
        id: 'rightDoughnut',
        labels: ['Earned points'],
        datasets: [
          {
            data: [332, 684], // [max: 100, 1016 - [1]]
            backgroundColor: ['#cf93cd', 'transparent'],
            cutout: 115,
            borderWidth: 0,
            borderRadius: [8, 0],
            spacing: -45,
          },
          {
            data: [100],
            backgroundColor: 'transparent',
            cutout: 115,
            borderWidth: 10,
            borderColor: 'rgba(231, 196, 242, 0.4)',
            hoverBorderColor: 'rgba(231, 196, 242, 0.4)',
          },
        ],
      };

      this.doughnutOptions = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              boxWidth: 13,
              boxHeight: 13,
              color: '#303030',
              font: {
                size: 25,
              },
            },
            position: 'bottom',
          },
          tooltip: {
            enabled: false,
          },
        },
        events: ['mousemove', 'mouseout', 'touchstart', 'touchmove'],
      };

      this.doughnutPlugins = [
        {
          id: 'doughnutLabel',
          beforeDatasetsDraw(chart: any) {
            const { ctx, data, config } = chart;
            const labelEnd =
              config._config.data.id === 'rightDoughnut' ? '' : '%';
            const textColor =
              config._config.data.id === 'rightDoughnut' ? '#C391C8' : '#7F8EC6';

            ctx.save();
            const xCoor = chart.getDatasetMeta(0).data[0].x;
            const yCoor = chart.getDatasetMeta(0).data[0].y;
            ctx.textAlign = 'center';
            ctx.font = 'bold 60px sans-serif';
            ctx.fillStyle = textColor;
            ctx.fillText(`${data.datasets[0].data[0]}${labelEnd}`, xCoor, yCoor);
          },
        },
      ];

      // BAR CHART

      this.barData = {
        labels: [1, 2, 3, 4, 5, 6, 7],
        datasets: [
          {
            label: '',
            data: [5, 59, 80, 41, 56, 35, 40],
            backgroundColor: '#1B59F8',
            borderRadius: 50,
            barPercentage: 0.5,
          },
          {
            label: '',
            data: [100, 100, 100, 100, 100, 100, 100],
            backgroundColor: '#F2F7FF',
            borderRadius: 50,
            barPercentage: 0.5,
            hoverBackgroundColor: '#F2F7FF',
          },
        ],
      };

      this.barOptions = {
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            filter: function (tooltipItem) {
              return tooltipItem.datasetIndex === 0;
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback: function (value: string) {
                return value + '%';
              },
            },
            grid: {
              display: false,
              drawOnChartArea: false,
            },
          },
          x: {
            grid: {
              display: false,
              drawOnChartArea: false,
            },
          },
        },
      };

      this.barPlugins = [
        {
          id: 'barBackground',
          beforeDatasetsDraw(chart: any) {
            const xCoorFront = chart.getDatasetMeta(0).data;
            const xCoorBg = chart.getDatasetMeta(1).data;
            const fx = xCoorFront[0].x;
            const bx = xCoorBg[0].x;
            const offset = Math.sqrt(Math.pow(fx - bx, 2)) / 2;

            for (let i = 0; i < xCoorFront.length; i++) {
              xCoorFront[i].x += offset;
              xCoorBg[i].x -= offset;
            }
          },
        },
      ];
  }
}
