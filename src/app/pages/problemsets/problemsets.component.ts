import { Component, OnInit, TransferState, makeStateKey } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SubmissionCardComponent } from '../../components/submission-card/submission-card.component';
import { AuthService } from '../../services/auth.service';
import { UserData } from '../../interfaces/user';
import { ProblemsetExtra } from '../../interfaces/problemset';
import { ProblemsetsService } from '../../services/problemsets.service';
import { firstValueFrom } from 'rxjs';
import { log } from 'console';
import { ProblemsetManagerService } from '../../services/problemset-manager.service';

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
    private problemsetManager: ProblemsetManagerService,
    private transferState: TransferState,
  ){}


  async ngOnInit() {
    await this.loadUserData();
    if(this.transferState.hasKey(makeStateKey('problemsetsCards'))){
        this.problemsets = this.transferState.get(makeStateKey('problemsetsCards'),null);
        return;
    }
    this.problemsets = await this.problemsetManager.loadUserProblemsets();
  }


  private async loadUserData() {
    this.user = await this.authService.checkIsUserInStorage();
  }
   
}
