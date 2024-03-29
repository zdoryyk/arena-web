import { Component, OnInit, TransferState, makeStateKey } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SubmissionCardComponent } from '../../components/submission-card/submission-card.component';
import { AuthService } from '../../services/auth.service';
import { UserData } from '../../interfaces/user';
import { ProblemsetExtra } from '../../interfaces/problemset';
import { ProblemsetsService } from '../../services/problemsets.service';
import { firstValueFrom } from 'rxjs';
import { log } from 'console';

@Component({
  selector: 'app-problemsets',
  standalone: true,
  imports: [RouterModule,SubmissionCardComponent],
  templateUrl: './problemsets.component.html',
  styleUrl: './problemsets.component.scss'
})
export class ProblemsetsComponent implements OnInit{

  user: UserData;
  problemsets: ProblemsetExtra[] = [];
  constructor
  (
    private authService: AuthService,
    private problemsetService: ProblemsetsService,
    private tranferState: TransferState,
  ){}


  async ngOnInit() {
    await this.loadUserData();
    if(this.tranferState.hasKey(makeStateKey('problemsetsCards'))){
        this.problemsets = this.tranferState.get(makeStateKey('problemsetsCards'),null);
        return;
    }
    await this.loadUserProblemsets();
  }

  private async loadUserProblemsets(){
    let userProblemsets = await firstValueFrom(this.problemsetService.getUserProblemsets());
    for(const userProblemset of userProblemsets.data.reverse()){
      let problemset = await firstValueFrom(this.problemsetService.getProblemsetDetailById(userProblemset.relationships.problemset.data.id));
      let submissions = await firstValueFrom(this.problemsetService.getUserSubmissionByProblemset(userProblemset.id));
      let lastSubmission = submissions.data[0];      
      
      const title = problemset.data.attributes.title;
      const isActive = problemset.data.attributes['date-finish'] > Date.now();
      const maxSubmissionScore = problemset.data.attributes['max-score'] as number;
      const submissionsLength = submissions.data.length;
      const lastScore = lastSubmission.attributes.score;
      const lastSubmitted = lastSubmission.attributes['date-evaluated'];
      
      let completeStatus =new Map<string, string>([
        ['warning','Task Incompleted'],
      ])
      if(maxSubmissionScore == lastScore){
        completeStatus = new Map<string, string>([
          ['success','Task completed'],
        ])
      }
      
      let problemsetExtra:ProblemsetExtra = {
        id: userProblemset.id,
        title: this.trimTitleFromLastYearOrColon(title),
        submissionsLength: submissionsLength,
        lastSubmissionScore: lastScore,
        lastSubmissionDate: lastSubmitted,
        maxSubmissionScore: maxSubmissionScore,
        isActive: isActive,
        completeStatus: completeStatus
      };
      this.problemsets = [...this.problemsets,problemsetExtra];
    }  
    this.tranferState.set<ProblemsetExtra[]>(makeStateKey('problemsetsCards'),this.problemsets);
  }


  private async loadUserData() {
    this.user = await this.authService.checkIsUserInStorage();
  }


  
  submissionData = {
    title: 'PROBLEMS TO SOLVE',
    totalSubmissions: 10,
    lastEvaluation: 0,
    lastSubmitDate: new Date('2022-03-01T18:02:00'),
    completeStatus: new Map<string, string>([
      ['warning','Task Incompleted'],
    ])
  };

  private trimTitleFromLastYearOrColon(title: string): string {
    const lastYearMatch = title.match(/\d{4}(?!.*\d{4})/); // Ищем последний год
    const lastYearIndex = lastYearMatch ? lastYearMatch.index + 4 : -1; // +4, чтобы перейти за год
  
    const lastColonIndex = title.lastIndexOf(":");
  
    let startIndex = Math.max(lastYearIndex, lastColonIndex);
  
    if (title[startIndex] === " " || title[startIndex] === ":") {
      startIndex++;
    }
  
    return title.substring(startIndex).trim();
  }
  
  
}
