import { UserRole } from '../constants/roles';

export interface SeedUserDefinition {
  fullName: string;
  email: string;
  role: UserRole;
}

export interface SeedResult {
  email: string;
  role: UserRole;
  status: 'created' | 'existing';
}
