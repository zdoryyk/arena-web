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
      data: any[];
    };
  };
  links: {
    self: string;
  };
}
