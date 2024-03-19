export interface Course {
  type: string;
  id: string;
  attributes: {
    title: string;
    description: string;
    archived: boolean;
  };
  relationships: {
    problemsets: {
      data: Array<{
        type: string;
        id: string;
      }>;
    };
    groups: {
      data: any[]; // Adjust accordingly
    };
  };
  links: {
    self: string;
  };
}
