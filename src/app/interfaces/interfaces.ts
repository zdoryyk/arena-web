export interface Submission {
  title: String;
  lastEvaluation: number;
  totalSubmissions: number;
  lastSubmitDate: Date;
  completeStatus: Map<String, String>;
}

export interface TestCase {
  quantity: number;
  bgColor: string;
}
