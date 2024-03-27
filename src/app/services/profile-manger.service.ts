import { HttpClient } from '@angular/common/http';
import { Injectable, TransferState } from '@angular/core';
import { AuthService } from './auth.service';
import { ProblemsetsService } from './problemsets.service';
import { CourseDetailService } from './course-detail.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileMangerService {

  constructor
  (
     private tranferState: TransferState,
     private authService: AuthService,
     private problemsetService: ProblemsetsService,
     private courseDetailService: CourseDetailService
  ) {}

   


  async getSubmissionsAndScores(){
    let user = await this.authService.checkIsUserInStorage();
    let totalScores = 0; 
    let maxTotalScores = 0;
    let totalsubmissions = 0;
    let rate = 0;
    let problemsets = await this.problemsetService.getUserProblemsetsByUserId(user.id).toPromise();
    
    let maxScore = 0; 
  
    for(let problemset of problemsets.data){
      let submissions = await this.problemsetService.getUserSubmissionByProblemset(problemset.id).toPromise();
      let problemsetDetail = await this.problemsetService.getProblemSetDetailsByProblemsetId(problemset.relationships.problemset.data.id).toPromise();
      submissions.data.forEach(submission => {
        let score = submission.attributes.score;
        if(score > maxScore) {
          maxScore = score; 
        }
      });
      maxTotalScores += problemsetDetail.data.attributes['max-score'];
      totalsubmissions += submissions.data.length;
      totalScores += maxScore;
    }
        
    rate = Number(((totalScores/maxTotalScores) * 100).toFixed(0));

    return {totalsubmissions, totalScores, maxTotalScores,rate};
  }
  


   async getSubmissionsByLimit(limit: number): Promise<Map<number, number[]>> {
    let user = await this.authService.checkIsUserInStorage();
    let problemsets = await this.problemsetService.getUserProblemsetsByUserId(user.id).toPromise();

    let lastProblemset = problemsets.data.reduce((max, problemset) => problemset.id > max.id ? problemset : max, problemsets.data[0]);
    let problemsetId = lastProblemset.relationships.problemset.data.id;
    
    let submissions = await this.problemsetService.getUserSubmissionByProblemset(lastProblemset.id).toPromise();
    let lastProblemsetDetails = await this.problemsetService.getProblemSetDetailsByProblemsetId(problemsetId).toPromise();
    let maxScore = lastProblemsetDetails.data.attributes['max-score'];

    let sortedSubmissions = submissions.data.sort((a, b) => {
        return new Date(b.attributes['date-evaluated']).getTime() - new Date(a.attributes['date-evaluated']).getTime();
    });

    if (limit > 0 && sortedSubmissions.length > limit) {
        sortedSubmissions = sortedSubmissions.slice(0, limit);
    }

    let submissionsMap = new Map<number, number[]>();
    let scores: number[] = []; 

    sortedSubmissions.forEach(element => {
        scores.push(element.attributes.score); 
    });

    submissionsMap.set(maxScore, scores); 
    return submissionsMap;
  }

}
