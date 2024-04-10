export interface ProblemsetExtra {
  id: string,
  title: string,
  submissionsLength: number,
  lastSubmissionScore: number,
  maxSubmissionScore: number
  lastSubmissionDate: Date,
  isActive: boolean,
  completeStatus: Map<string, string>
}



export interface Problemset {

      type: string;
      id: string;
      attributes: {
        description: string;
        "chart-links": {
          submissions: string;
        };
        pid: string;
        title: string;
        "max-score": number;
        "max-evals": number | null;
        "date-start": string;
        "date-finish": string;
        "eval-interval": number | null;
        revision: number;
      };
      relationships: {
        course: {
          data: {
            type: string;
            id: string;
          };
        };
      };
      links: {
        self: string;
      };
      courseName?: string;
      courseId: string;
  }
  
  export interface ProblemsetsResponse {
    data: ProblemsetData[];
  }
  
  export interface ProblemsetData {
    type: string;
    id: string;
    attributes: ProblemsetAttributes;
    relationships: ProblemsetRelationships;
    links: ProblemsetLinks;
  }
  
  export interface ProblemsetAttributes {
    description: string;
    'chart-links': ChartLinks;
    pid: string;
    title: string;
    'max-score': number;
    'max-evals': number | null;
    'date-start': string;
    'date-finish': string;
    'eval-interval': number | null;
    revision: number;
  }
  
  export interface ChartLinks {
    submissions: string;
  }
  
  export interface ProblemsetRelationships {
    course: CourseRelationship;
  }
  
  export interface CourseRelationship {
    data: CourseData;
  }
  
  export interface CourseData {
    type: string;
    id: string;
  }
  
  export interface ProblemsetLinks {
    self: string;
  } 