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
  granted: string | Date | undefined;
  revoked: string | Date | undefined | null;
  created: string | Date | number | undefined;
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