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
  problemsets: any[]
}

export interface ProblemsetModel {
  data: {
      type: string,
      attributes: {
          description: string,
          pid: string,
          title: string,
          max_score: number,
          date_start: string,
          date_finish: string
      },
      relationships: {
          course: {
              data: {
                  type: string,
                  id: string
              }
          }
      }
  }
}

export interface GroupPaginationModel {
  name: string,
  submissions: number,
}

export interface ConfirmDialogData {
  title: string;
  message : string;
}