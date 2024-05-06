import { Injectable, TransferState, makeStateKey } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ProblemsetsService } from './problemsets.service';
import { ProblemsetExtra } from '../interfaces/problemset';
import { NestedTask, Submission, Task, TaskData } from '../interfaces/submission';

@Injectable({
  providedIn: 'root'
})
export class ProblemsetManagerService {

  constructor(
    private problemsetService: ProblemsetsService,
    private tranferState: TransferState,
  ) { }




  async getSortedTasksByTypeAndSuits(id: string):Promise<NestedTask[]> {
    let taskData = await firstValueFrom(this.problemsetService.getSubmissionTasks(id));
    let nestedTasks = this.nestTasks(taskData.data);
    console.log(nestedTasks);
    
    return nestedTasks;
  }


  nestTasks(tasks: Task[]): NestedTask[] {
    const taskMap: { [id: string]: NestedTask } = {};

    tasks.forEach(task => {
        taskMap[task.id] = { ...task, children: [] };
    });

    const rootTasks: NestedTask[] = [];
    Object.values(taskMap).forEach(task => {
        const parentId = task.relationships['parent-task'].data?.id;
        if (parentId) {
            if (taskMap[parentId]) {
                taskMap[parentId].children.push(task);
            }
        } else {
            rootTasks.push(task);
        }
    });

    return rootTasks;
  }



  async getProblemsetLastSubmissionsByLimitById(limit: number, id:string){
    let submissions = await firstValueFrom(this.problemsetService.getUserSubmissionByProblemset(id));
    const lastSubmissions = submissions.data.slice(0, limit);
    return lastSubmissions.map(submission => ({
        'date-evaluated': submission.attributes['date-evaluated'],
        'score': submission.attributes.score
    }));
  }


  async loadProblemsets() {
    let problemsets = [];
    let userProblemsets = await firstValueFrom(this.problemsetService.getUserProblemsets())
    for(const userProblemset of userProblemsets.data.reverse()){
      let problemset = await firstValueFrom(this.problemsetService.getProblemsetDetailById(userProblemset.relationships.problemset.data.id));
      let submissions = await firstValueFrom(this.problemsetService.getUserSubmissionByProblemset(userProblemset.id));
      let lastSubmission = submissions.data[0];
      
      const title = problemset.data.attributes.title;
      const isActive = new Date(problemset.data.attributes['date-finish']).getTime() > Date.now();
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
        title: this.problemsetService.trimTitleFromLastYearOrColon(title),
        submissionsLength: submissionsLength,
        lastSubmissionScore: lastScore,
        lastSubmissionDate: lastSubmitted,
        maxSubmissionScore: maxSubmissionScore,
        isActive: isActive,
        completeStatus: completeStatus
      };
      problemsets = [...problemsets,problemsetExtra];
    }  
    this.tranferState.set<ProblemsetExtra[]>(makeStateKey('problemsetsCards'),problemsets);
    return problemsets;
  }
}
