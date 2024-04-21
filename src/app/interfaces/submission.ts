export interface TaskData {
  iterationNumber?: number;
  type: string;
  id: string;
  attributes: {
    document: {
      id: string;
      type: string;
      score: number | null;
      title: string;
      passed: boolean;
      strict: boolean;
      duration: number;
      failures: any[]; 
      'max-score': number | null;
      description: string | null;
    };
    'task-id': string;
    title: string;
    score: number | null;
    'max-score': number | null;
    strict: boolean;
    passed: boolean;
    type: string;
  };
  relationships: {
    'parent-task': {
      data: any; 
    };
    tasks: {
      data: Array<{
        type: string;
        id: string;
      }>;
    };
    submission: {
      data: {
        type: string;
        id: string;
      };
    };
  };
  links: {
    self: string;
  };
}


export interface Submission {
  iterationNumber?: number;
  type: string;
  id: string;
  attributes: Attributes;
  relationships: Relationships;
  links: Links;
}

export interface Attributes {
  document: Document;
  "task-id": string;
  title: string;
  score: number;
  "max-score": number;
  strict: boolean;
  passed: boolean;
  type: string;
}

export interface Document {
  id: string;
  type: string;
  score: number;
  title: string;
  passed: boolean;
  result: any;
  strict: boolean;
  duration: number;
  expected?: any;
  failures: any[];
  "max-score": number;
  description: null | string; 
}

export interface Relationships {
  "parent-task": ParentTask;
  tasks: Tasks;
  submission: SubmissionData;
}

export interface ParentTask {
  data: null;
}

export interface Tasks {
  data: TaskData[];
}

export interface SubmissionData {
  data: {
    type: string;
    id: string;
  };
}

export interface Links {
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


export interface Task {
  id: string;
  attributes: Attributes,
  relationships: {
      parentTask: {
          data: {
              type: string;
              id: string | null;
          };
      };
      tasks: {
          data: { type: string; id: string }[];
      };
  };
}

export interface NestedTask extends Task {
  children?: NestedTask[];
  isModule?: boolean; 
}
