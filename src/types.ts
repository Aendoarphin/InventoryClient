export interface Employee {
  id: number;
  first: string;
  last: string;
  branch: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  created: string;
}

export interface Resource {
  id: number;
  name: string;
  categoryId: number;
}

export interface ResourceAssociations {
  id: number;
  resourceId: number;
  employeeId: number;
  created: number;
}

export interface AccessLevel {
  id: number;
  name: string;
}

export type FormData = Omit<Employee, "id">;