import { AppRequestStatus } from "../../types/enums.js";

export interface CreateAppRequestInput {
  appId: string;
  requestReason: string;
}

export interface ListAppRequestsQuery {
  status?: AppRequestStatus;
  page?: number;
  limit?: number;
}

export interface RejectAppRequestInput {
  rejectionReason: string;
}
