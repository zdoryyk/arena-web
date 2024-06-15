import { Component, HostListener, OnInit, TransferState, makeStateKey } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SubmissionCardComponent } from '../../components/submission-card/submission-card.component';
import { UserData } from '../../interfaces/user';
import { ProblemsetExtra } from '../../interfaces/problemset';
import { ProblemsetManagerService } from './problemset-manager.service';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core-services/language.service';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-problemsets',
  standalone: true,
  imports: [RouterModule,SubmissionCardComponent,SkeletonModule,TranslateModule],
  templateUrl: './problemsets.component.html',
  styleUrl: './problemsets.component.scss'
})
export class ProblemsetsComponent implements OnInit{
  isAnyActiveProblemset = false;
  isLoading = true;
  user: UserData;
  problemsets: ProblemsetExtra[] = [];
  public skeletonCount: number = 6;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.adjustSkeletonCount();
  }

  constructor
  (
    private authService: AuthService,
    private problemsetManager: ProblemsetManagerService,
    private transferState: TransferState,
    private translate: TranslateService,
    private languageService: LanguageService,
  ){}


  async ngOnInit() {
    this.languageService.lang$.subscribe(lang => {
      this.translate.use(lang);
    });
    this.adjustSkeletonCount();
    await this.loadUserData();
    if(this.transferState.hasKey(makeStateKey('problemsetsCards'))){
      this.problemsets = this.transferState.get(makeStateKey('problemsetsCards'),null);
    }else{
      this.problemsets = await this.problemsetManager.loadProblemsets();
    }
    this.checkForAnyActiveProblemset();
    this.isLoading = false;
  }

  private adjustSkeletonCount() {
    const containerWidth = window.innerWidth; // or a specific container's width
    const itemWidth = 300; // width of each skeleton card
    const itemsPerRow = Math.floor(containerWidth / itemWidth);
    const rowCount = Math.floor(window.innerHeight / 200); // assuming each skeleton card has a height of 200px
    this.skeletonCount = itemsPerRow * rowCount;
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
