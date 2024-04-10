import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription, firstValueFrom, forkJoin } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { CourseDetailService } from '../../../services/course-detail.service';
import { User, UserData } from '../../../interfaces/user';
import { ProblemsetsService } from '../../../services/problemsets.service';
import { Group } from '../../../interfaces/group';
import { ProblemsetData } from '../../../interfaces/problemset';
import { MatButton } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';

interface ProblemsetPreview {
  title: string,
  score: string,
  id: string,
}

interface ExtendedUser {
  groupName: string,
  fullName: string;
  problemSet: ProblemsetPreview; 
  data: UserData; 
}

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    MatButton,
    TableModule,
    RouterModule,
  ],
  templateUrl: './group-detail.component.html',
  styleUrl: './group-detail.component.scss'
})
export class GroupDetailComponent implements OnInit,OnDestroy {

  private isActive: boolean = true;
  @Input() groups: Group[];
  @Input() problemsets: ProblemsetData[];

  private subscription: Subscription = new Subscription();
  students: ExtendedUser[] = []; 
  s: ProblemsetData

  constructor(
    private router: Router,
    private courseService: CourseDetailService,
    private problemsetService: ProblemsetsService,
    private cd: ChangeDetectorRef
  ) {}


    ngOnInit() {
      console.log( window.innerWidth);
      this.cd.markForCheck();
      this.loadGroupDetails(this.groups);
  }

  async loadGroupDetails(groups: Group[]) {
    for (const group of groups) {
      let students = group.relationships.students.data;
      for (const student of students) {
        try {
          const userData = await firstValueFrom(this.courseService.getUserById(student.id));
          const problemsetsResponse = await firstValueFrom(this.problemsetService.getUserProblemsetsByUserId(student.id));
          const sorted = await this.sortUsersProblemsets(problemsetsResponse.data);
          for (const userProblemset of sorted) {
              if(!this.isActive){
                continue;
              }
              const problemsetDataPromise = firstValueFrom(this.problemsetService.getProblemsetDetailById(userProblemset.relationships.problemset.data.id));
              const latestSubmissionDataPromise = firstValueFrom(this.courseService.getLatestSubmissionById(userProblemset.relationships['latest-submission'].data.id));
              
              const resData = await Promise.all([problemsetDataPromise, latestSubmissionDataPromise]);
              
              const problemsetPreview: ProblemsetPreview = {
                title: this.problemsetService.trimTitleFromLastYearOrColon(`${resData[0].data.attributes.title}`),
                score: this.formatEvaluationScore(resData[1].data.attributes.score),
                id: resData[1].data.id,
              };
              
              let studentNew: ExtendedUser = {
                groupName: this.problemsetService.trimGroupTitle(group.attributes.name),
                fullName: `${userData.data.attributes['first-name']} ${userData.data.attributes['last-name']}`,
                problemSet: problemsetPreview,
                data: userData.data
              };
              this.students = [...this.students,studentNew];
          }
        } catch (error) {
          console.error('Error fetching group data:', error);
        }
      }
    }
  }

  async sortUsersProblemsets(userProblemsets: any[]) {
    const userProblemsetIds = this.problemsets.map(ps => ps.id);    
    let filteredProblemsets = userProblemsets.filter(problemset => userProblemsetIds.includes(problemset.relationships.problemset.data.id));
    return filteredProblemsets;
  }

  checkIsProblemsetFromThisCourse(id: string): boolean {
    return this.problemsets.some(problemset => problemset.id === id);
  }

  formatEvaluationScore(score: number): string {
    const roundedScore = score.toFixed(1);
    return roundedScore.endsWith('.0') ? Math.floor(score).toString() : roundedScore;
  }

  clear(table: Table) {
    table.clear();
  }

  ngOnDestroy() {
    this.isActive = false;
    this.subscription.unsubscribe();
  }

}

