import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription, firstValueFrom, forkJoin } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CourseDetailService } from '../../../services/course-detail.service';
import { User, UserData } from '../../../interfaces/user';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { ProblemsetsService } from '../../../services/problemsets.service';
import { Group } from '../../../interfaces/group';
import { ProblemsetData } from '../../../interfaces/problemset';
import { MatButton } from '@angular/material/button';

interface ProblemsetPreview {
  title: string,
  score: string,
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
    NgbAlert
  ],
  templateUrl: './group-detail.component.html',
  styleUrl: './group-detail.component.scss'
})
export class GroupDetailComponent implements OnInit,OnChanges,OnDestroy {

  private isActive: boolean = true;
  @Input() groups: Group[];
  @Input() problemsets: ProblemsetData[];

  private subscription: Subscription = new Subscription();
  students: ExtendedUser[] = []; 


  constructor(
    private courseService: CourseDetailService,
    private problemsetService: ProblemsetsService,
    private cd: ChangeDetectorRef
  ) {}


    ngOnInit() {
      this.cd.markForCheck();
      console.log(this.groups);
      this.loadGroupDetails(this.groups);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['problemsets'] && this.problemsets) {
        console.log('Problemsets received: ', this.problemsets);
    }
}

  async loadGroupDetails(groups: Group[]) {
    for (const group of groups) {
      let students = group.relationships.students.data;
      for (const student of students) {
        try {
          const userData = await firstValueFrom(this.courseService.getUserById(student.id));
          const problemsetsResponse = await firstValueFrom(this.problemsetService.getUserProblemsetsByUserId(student.id));
          
          for (const userProblemset of problemsetsResponse.data) {
            if (userProblemset.relationships.group.data) {
              const problemsetDataPromise = firstValueFrom(this.problemsetService.getProblemsetDetailById(userProblemset.relationships.problemset.data.id));
              const latestSubmissionDataPromise = firstValueFrom(this.courseService.getLatestSubmissionById(userProblemset.relationships['latest-submission'].data.id));
              
              const resData = await Promise.all([problemsetDataPromise, latestSubmissionDataPromise]);

              if(!this.isActive || !this.checkIsProblemsetFromThisCourse(resData[0].data.id)){
                continue;
              }
              const problemsetPreview: ProblemsetPreview = {
                title: `${resData[0].data.attributes.title}`,
                score: `${resData[1].data.attributes.score}`,
              };
              
              let studentNew: ExtendedUser = {
                groupName: group.attributes.name,
                fullName: `${userData.data.attributes['first-name']} ${userData.data.attributes['last-name']}`,
                problemSet: problemsetPreview,
                data: userData.data
              };
              this.students = [...this.students,studentNew];
            }
          }
        } catch (error) {
          console.error('Error fetching group data:', error);
        }
      }
    }
  }

  checkIsProblemsetFromThisCourse(id: string): boolean {
    return this.problemsets.some(problemset => problemset.id === id);
  }



  ngOnDestroy() {
    this.isActive = false;
    this.subscription.unsubscribe();
  }

}

