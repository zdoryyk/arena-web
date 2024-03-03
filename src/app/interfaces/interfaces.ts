export interface Submission {
  title: String;
  lastEvaluation: number;
  totalSubmissions: number;
  lastSubmitDate: Date;
  completeStatus: Map<String, String>;
}
