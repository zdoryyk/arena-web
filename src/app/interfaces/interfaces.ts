export interface Submission {
  title: String;
  lastEvaluation: number;
  totalSubmissions: number;
  lastSubmitDate: Date;
  completeStatus: Map<String, String>;
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

export interface ConfirmDialogData {
  title: string;
  message : string;
}