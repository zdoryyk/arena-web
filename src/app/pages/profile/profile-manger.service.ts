import { Injectable } from '@angular/core';
import { ProblemsetsService } from '../problemsets/problemsets.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../login/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileMangerService {

  constructor
  (
     private authService: AuthService,
     private problemsetService: ProblemsetsService,
  ) {}




  async getSubmissionsAndScores(){
    let user = await this.authService.checkIsUserInStorage();
    let totalScores = 0;
    let maxTotalScores = 0;
    let totalsubmissions = 0;
    let rate = 0;
    let problemsets = await firstValueFrom(this.problemsetService.getUserProblemsetsByUserId(user.id));

    let maxScore = 0;

    for(let problemset of problemsets.data){
      let submissions = await firstValueFrom(this.problemsetService.getUserSubmissionByProblemset(problemset.id));
      let problemsetDetail = await firstValueFrom(this.problemsetService.getProblemSetDetailsByProblemsetId(problemset.relationships.problemset.data.id));
      submissions.data.forEach(submission => {
        let score = submission.attributes.score;
        if(score > maxScore) {
          maxScore = score;
        }
      });
      maxTotalScores += problemsetDetail.data.attributes['max-score'];
      totalsubmissions += submissions.data.length;
      totalScores += maxScore;
      maxScore = 0;
    }

    rate = Number(((totalScores/maxTotalScores) * 100).toFixed(0));

    return {totalsubmissions, totalScores, maxTotalScores,rate};
  }



  async getSubmissionsByLimit(limit: number): Promise<any> {
    let user = await this.authService.checkIsUserInStorage();
    let userProblemsets = await firstValueFrom(this.problemsetService.getUserProblemsetsByUserId(user.id));
    if (userProblemsets.data.length == 0) {
      return;
    }

    let lastUserProblemset = userProblemsets.data.reduce((max, problemset) => problemset.id > max.id ? problemset : max, userProblemsets.data[0]);
    let problemsetId = lastUserProblemset.relationships.problemset.data.id;

    let submissions = await this.problemsetService.getUserSubmissionByProblemset(lastUserProblemset.id).toPromise();
    let lastProblemsetDetails = await this.problemsetService.getProblemSetDetailsByProblemsetId(problemsetId).toPromise();
    let maxScore = lastProblemsetDetails.data.attributes['max-score'];
    let problemsetTitle = this.trimTitleFromLastYearOrColon(lastProblemsetDetails.data.attributes.title);


    let sortedSubmissions = submissions.data.sort((a, b) => {
        return new Date(b.attributes['date-evaluated']).getTime() - new Date(a.attributes['date-evaluated']).getTime();
    });
    if (limit > 0 && sortedSubmissions.length > limit) {
        sortedSubmissions = sortedSubmissions.slice(0, limit);
    }

    let submissionDetails = sortedSubmissions.map(element => ({
        score: element.attributes.score,
        dateEvaluated: element.attributes['date-evaluated'],
        id: element.id
    }));

    return { maxScore, submissionDetails, problemsetTitle };
}


  private trimTitleFromLastYearOrColon(title: string): string {
    const lastYearMatch = title.match(/\d{4}(?!.*\d{4})/);
    const lastYearIndex = lastYearMatch ? lastYearMatch.index + 4 : -1;

    const lastColonIndex = title.lastIndexOf(":");

    let startIndex = Math.max(lastYearIndex, lastColonIndex);

    if (title[startIndex] === " " || title[startIndex] === ":") {
      startIndex++;
    }

    return title.substring(startIndex).trim();
  }

}
