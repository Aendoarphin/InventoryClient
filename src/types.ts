export interface AccessLevel {
  id: number;
  name: string;
  active: number;
}

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

export interface ResourceAssociation {
  id: number;
  resourceId: number;
  employeeId: number;
  granted: Date;
  revoked: Date;
  created: number;
}

export interface Resource {
  id: number;
  name: string;
  categoryId: number;
  accessLevelId: number;
}

export interface ResourceCategory {
  id: number;
  name: string;
  active: number;
}