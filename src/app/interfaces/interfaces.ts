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