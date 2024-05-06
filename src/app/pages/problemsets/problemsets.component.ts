import { Component, OnInit, TransferState, makeStateKey } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SubmissionCardComponent } from '../../components/submission-card/submission-card.component';
import { AuthService } from '../../services/auth.service';
import { UserData } from '../../interfaces/user';
import { ProblemsetExtra } from '../../interfaces/problemset';
import { ProblemsetManagerService } from '../../services/problemset-manager.service';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-problemsets',
  standalone: true,
  imports: [RouterModule,SubmissionCardComponent,SkeletonModule],
  templateUrl: './problemsets.component.html',
  styleUrl: './problemsets.component.scss'
})
export class ProblemsetsComponent implements OnInit{
  isAnyActiveProblemset = false;
  isLoading = true;
  user: UserData;
  problemsets: ProblemsetExtra[] = [];

  constructor
  (
    private authService: AuthService,
    private problemsetManager: ProblemsetManagerService,
    private transferState: TransferState,
  ){}


  async ngOnInit() {
    await this.loadUserData();
    if(this.transferState.hasKey(makeStateKey('problemsetsCards'))){
      this.problemsets = this.transferState.get(makeStateKey('problemsetsCards'),null);
    }else{
      this.problemsets = await this.problemsetManager.loadProblemsets();
    }
    this.checkForAnyActiveProblemset();
    this.isLoading = false;
  }

  private async loadUserData() {
    this.user = await this.authService.checkIsUserInStorage();
  }
  
  private checkForAnyActiveProblemset(){
    for(const problemset of this.problemsets){
      if(problemset.isActive){
        this.isAnyActiveProblemset = true;
      }
    }
  }
}
