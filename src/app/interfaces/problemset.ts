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
  }
  