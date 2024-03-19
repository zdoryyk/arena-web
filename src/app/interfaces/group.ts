export interface GroupResponse {
    data: Group[];
  }
  
  export interface Group {
    type: string;
    id: string;
    attributes: GroupAttributes;
    relationships: GroupRelationships;
    links: GroupLinks;
  }
  
  export interface GroupAttributes {
    name: string;
  }
  
  export interface GroupRelationships {
    course: Relationship<Course>;
    students: Relationship<Student[]>;
  }
  
  export interface Relationship<T> {
    data: T;
  }
  
  export interface Course {
    type: string;
    id: string;
  }
  
  export interface Student {
    type: string;
    id: string;
  }
  
  export interface GroupLinks {
    self: string;
  }
  