export interface Submission {
  title: String;
  lastEvaluation: number;
  totalSubmissions: number;
  lastSubmitDate: Date;
  completeStatus: Map<String, String>;
}

export interface AdminCourseCard{
  title: String;
  groups: number;
  problemsets?: number,
  created?: Date;
}

export interface AdminProblemsetCard{
  title: String;
  groups: number;
  course: String;
  created?: Date;
}

export interface CourseModel {
  data: {
      type: string,
      attributes: {
          title: string,
          description: string
      }
  }
}

export interface CourseModelGet {
  id: string,
  name: string,
  archived: boolean,
  description: string,
  groups: any[],
  problemsets: any[],
}

export interface GroupPaginationModel {
  name: string,
  submissions: number,
}

export interface ConfirmDialogData {
  title: string;
  message : string;
}


export interface UserSubmission {
  user: string;
  group: string;
  submissions: SubmissionChart[];
}

export interface SubmissionChart {
  id: string;
  score: number;
  "date-evaluated": any;
}