export interface IBranch {
  _id?: string;
  tenantId: string;
  name: string;
  code: string;
  type: BranchType;
  address: IBranchAddress;
  contactDetails: IBranchContact;
  settings: IBranchSettings;
  headOfBranch?: string;
  departments: string[];
  employees: IBranchEmployee[];
  operationalHours: IOperationalHours;
  facilities: IBranchFacility[];
  geofence?: IGeofence;
  isActive: boolean;
  establishedDate: Date;
  timezone: string;
  currency: string;
  costCenter?: string;
  budgetAllocation?: number;
  createdAt: Date;
  updatedAt: Date;
}

export