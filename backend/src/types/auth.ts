import { UserRole } from "./enums.js";

export interface AuthUser {
  id: string;
  role: UserRole;
  organizationId: string;
}
