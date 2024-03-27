export interface UserAttributes {
    username: string;
    email: string;
    "first-name": string;
    "last-name": string;
    "is-lecturer": boolean;
  }
  
  export interface CourseData {
    type: string;
    id: string;
  }
  
 export interface ProblemSetData {
    type: string;
    id: string;
  }
  
  export interface UserProblemSetData {
    type: string;
    id: string;
  }
  
  export interface RoleData {
    type: string;
    id: string;
  }
  
  export interface UserRelationships {
    courses: {
      data: CourseData[];
    };
    problemsets: {
      data: ProblemSetData[];
    };
    "user-problemsets": {
      data: UserProblemSetData[];
    };
    roles: {
      data: RoleData[];
    };
    "lecturers-groups": {
      data: any[]; // Замените any на более конкретный тип, если он известен
    };
  }
  
  // Определение интерфейса для самого пользователя
  export interface UserData {
    type: string;
    id: string;
    attributes: UserAttributes;
    relationships: UserRelationships;
    links: {
      self: string;
    };
  }
  
  export interface User {
    data: UserData;
  }


  export interface ExtendedUserProfile{
    fullName: string,
    problemsetsLength: number,
    submissionsLength: number,
    totalScore: number,
    maxTotalScore: number,
    latestProblemsets: any
    rate: number,
    data: UserData
  }
  