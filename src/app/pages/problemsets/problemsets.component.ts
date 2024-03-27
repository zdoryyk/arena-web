import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SubmissionCardComponent } from '../../components/submission-card/submission-card.component';
import { AuthService } from '../../services/auth.service';
import { UserData } from '../../interfaces/user';

@Component({
  selector: 'app-problemsets',
  standalone: true,
  imports: [RouterModule,SubmissionCardComponent],
  templateUrl: './problemsets.component.html',
  styleUrl: './problemsets.component.scss'
})
export class ProblemsetsComponent implements OnInit{

  user: UserData;
  constructor(private authService: AuthService){}


  async ngOnInit() {
    await this.loadUserData();
  }


  private async loadUserData() {
    this.user = await this.authService.checkIsUserInStorage();
    console.log('user, ', this.user);
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
}
