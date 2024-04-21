import { Component, OnInit, TransferState } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserData } from '../../../interfaces/user';
import { SubmissionCardComponent } from '../../../components/submission-card/submission-card.component';
import { ProblemsetsService } from '../../../services/problemsets.service';
import { firstValueFrom } from 'rxjs';
import { SubmissionPreview } from '../../../interfaces/submission';
import { Problemset } from '../../../interfaces/problemset';
import { SubmissionDetailCardComponent } from '../../../components/submission-detail-card/submission-detail-card.component';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-problemests-detail',
  standalone: true,
  imports: [RouterModule,SubmissionDetailCardComponent,SkeletonModule],
  templateUrl: './problemests-detail.component.html',
  styleUrl: './problemests-detail.component.scss'
})
export class ProblemestsDetailComponent implements OnInit {

  user: UserData;
  problemsetId: string;
  problemset: Problemset;
  submissions: SubmissionPreview[];

  constructor(
    private authService: AuthService,
    private problemsetService: ProblemsetsService,
    private activeRoute: ActivatedRoute,
  ){}

  async ngOnInit(){
    console.log(window.innerWidth);
    
    await this.loadUserData();
    this.problemsetId = this.activeRoute.snapshot.paramMap.get('id');
    await this.loadPageData();
  }


  private async loadPageData(){
    await this.getProblemsetData();
    await this.getSubmissions();
  
    this.submissions.forEach(sub => {
      let completeStatus =new Map<string, string>([
        ['warning','Task Incompleted'],
      ]);
      if(sub.attributes.score == this.problemset.attributes['max-score']){
        completeStatus = new Map<string, string>([
          ['success','Task completed'],
        ])
      }
      sub.completeStatus = completeStatus;
    });
  }

  private async getProblemsetData(){
    let problemsetData = await firstValueFrom(this.problemsetService.getProblemsetByUserProblemset(this.problemsetId));
    this.problemset = problemsetData.data;
    this.problemset.attributes.title = this.problemsetService.trimTitleFromLastYearOrColon(this.problemset.attributes.title);
    
  }

  private async getSubmissions(){
   let submissionsData= await firstValueFrom(this.problemsetService.getUserSubmissionByProblemset(this.problemsetId));
   this.submissions = submissionsData.data;

  }


  private async loadUserData() {
    this.user = await this.authService.checkIsUserInStorage();
  }
}
