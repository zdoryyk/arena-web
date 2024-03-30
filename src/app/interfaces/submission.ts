interface Submission {
  type: string;
  id: string;
  attributes: Attributes;
  relationships: Relationships;
  links: Links;
}

interface Attributes {
  document: Document;
  "task-id": string;
  title: string;
  score: number;
  "max-score": number;
  strict: boolean;
  passed: boolean;
  type: string;
}

interface Document {
  id: string;
  type: string;
  score: number;
  title: string;
  passed: boolean;
  strict: boolean;
  duration: number;
  failures: any[];
  "max-score": number;
  description: null | string; 
}

interface Relationships {
  "parent-task": ParentTask;
  tasks: Tasks;
  submission: SubmissionData;
}

interface ParentTask {
  data: null;
}

interface Tasks {
  data: TaskData[];
}

interface TaskData {
  type: string;
  id: string;
}

interface SubmissionData {
  data: {
    type: string;
    id: string;
  };
}

interface Links {
  self: string;
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