import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription, firstValueFrom, forkJoin } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { CourseDetailService } from '../../services/course-detail.service';
import { User, UserData } from '../../interfaces/user';
import { ProblemsetsService } from '../../services/problemsets.service';
import { Group } from '../../interfaces/group';
import { ProblemsetData } from '../../interfaces/problemset';
import { MatButton } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { log } from 'console';


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

interface GroupOption {
  name: string;
  data: Group;
  isUsed: boolean;
}

interface ProblemsetOption {
  title: string;
  data: ProblemsetData;
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
    MultiSelectModule,
    FormsModule,
  ],
  templateUrl: './group-detail.component.html',
  styleUrl: './group-detail.component.scss'
})
export class GroupDetailComponent implements OnInit,OnDestroy {

  isMobile = false;
  private isActive: boolean = true;
  @Input() groups: Group[];
  @Input() problemsets: ProblemsetData[];


  groupOptions!: GroupOption[];
  selectedGroups!: GroupOption[]; 
  problemsetOptions!: ProblemsetOption[];
  selectedProblemsets: ProblemsetOption[] = [];
  private studentsCopy: ExtendedUser[] = [];
  private loadingSubscription: Subscription = new Subscription(); 
  private subscription: Subscription = new Subscription();
  students: ExtendedUser[] = []; 

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(window.innerWidth <= 600){
      this.isMobile = true;
    }else{
      this.isMobile = false;
    }
  }

  constructor(
    private courseService: CourseDetailService,
    private problemsetService: ProblemsetsService,
    private cd: ChangeDetectorRef
  ) {}


    async ngOnInit() {
      this.groupOptions = this.groups.map(group => ({
        name: this.problemsetService.trimGroupTitle(group.attributes.name),
        data: group,
        isUsed: false,
      }));
      this.problemsetOptions = this.problemsets.map(problemset => ({
        data: problemset,
        title: this.problemsetService.trimTitleFromLastYearOrColon(problemset.attributes.title)
      }));
      if(window.innerWidth <= 600){
        this.isMobile = true;
      }
      this.cd.markForCheck();

  }

  async onGroupSelectionChange() {
    this.groupOptions.forEach(group => {
      if (!this.selectedGroups.some(selectedGroup => selectedGroup.data.id === group.data.id)) {
        group.isUsed = false;
      }
    });
    this.filterCurrentStudents();
    if (this.selectedGroups.length > 0) {
      this.loadingSubscription.unsubscribe();
      this.loadingSubscription = new Subscription();
        this.selectedGroups.forEach(async groupOption => {
            const group = this.groupOptions.find(g => g.data.id === groupOption.data.id);
            if (group && !group.isUsed) {
                await this.loadGroupDetails(group.data);
                group.isUsed = true;
            }
        });
    } else {
        this.students = [];
        this.loadingSubscription.unsubscribe();
    }
  }

  filterCurrentStudents() {
    const selectedGroupNames = new Set(this.selectedGroups.map(group => this.problemsetService.trimGroupTitle(group.data.attributes.name)));
    this.students = this.students.filter(student => selectedGroupNames.has(student.groupName));
  }

  onProblemsetSelectionChange() {
    if(this.selectedProblemsets.length > 0){  
      this.students = this.studentsCopy;
      const selectedProblemsetNames = new Set(this.selectedProblemsets.map(ps => ps.title));
      this.students = this.students.filter(student => 
        student.problemSet && selectedProblemsetNames.has(student.problemSet.title));
    }else if(this.selectedProblemsets.length == 0){
      this.students = this.studentsCopy;
    }
  }


  async loadGroupDetails(group: Group) {
      let students = group.relationships.students.data;
      for (const student of students) {
        this.loadingSubscription.add(
          forkJoin({
            userData: this.courseService.getUserById(student.id),
            problemsetsResponse: this.problemsetService.getUserProblemsetsByUserId(student.id)
          }).subscribe(async ({userData, problemsetsResponse}) => {
            const sorted = await this.sortUsersProblemsets(problemsetsResponse.data);
            sorted.forEach(async userProblemset => {
              if (!this.isActive) {
                return;
              }
              forkJoin({
                problemsetData: this.problemsetService.getProblemsetDetailById(userProblemset.relationships.problemset.data.id),
                latestSubmissionData: this.courseService.getLatestSubmissionById(userProblemset.relationships['latest-submission'].data.id)
              }).subscribe(({problemsetData, latestSubmissionData}) => {
                const problemsetPreview: ProblemsetPreview = {
                  title: this.problemsetService.trimTitleFromLastYearOrColon(`${problemsetData.data.attributes.title}`),
                  score: this.formatEvaluationScore(latestSubmissionData.data.attributes.score),
                  id: latestSubmissionData.data.id,
                };
                
                let trimmedGroupName = this.problemsetService.trimGroupTitle(group.attributes.name);
                let studentNew: ExtendedUser = {
                  groupName: trimmedGroupName,
                  fullName: `${userData.data.attributes['first-name']} ${userData.data.attributes['last-name']}`,
                  problemSet: problemsetPreview,
                  data: userData.data
                };
                if (this.selectedGroups.some(g => g.name === trimmedGroupName)) {
                  if(this.selectedProblemsets.length == 0 || this.selectedProblemsets.some(prob => prob.title === problemsetPreview.title)){
                    this.students.push(studentNew);
                  }
                  this.studentsCopy.push(studentNew);
                }
              });
            });
          })
        );
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
    this.loadingSubscription.unsubscribe();
    this.subscription.unsubscribe();
  }

}