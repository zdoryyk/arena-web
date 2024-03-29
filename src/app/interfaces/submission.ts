export interface Submission {
    author: string,
    problemset: string,
    submissionId: string,
    submittedOn: string,
    evaluatedOn: string,
    actualScore: number,
    maxScore: number,
    percentualActualScore: number,
    repository: string,
    revision: string,
    ssh: string
  }
  
  export interface SubmissionPreview {
    type: string;
    id: string;
    completeStatus: Map<string, string>;
    relationships: {
      'user-problemset': {
        data: {
          type: string;
          id: string;
        }
      },
      tasks: {
        links: {
          related: string;
        }
      }
    },
    attributes: {
      'date-evaluated': string;
      score: number;
    },
    links: {
      self: string;
    },
  }