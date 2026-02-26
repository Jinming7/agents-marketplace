export const USER_ROLES = ["ORG_ADMIN", "PRODUCT_ADMIN", "USER"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const APP_REQUEST_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;
export type AppRequestStatus = (typeof APP_REQUEST_STATUSES)[number];
