export class NotificationService {
  async notifyAdminsForNewRequest(params: {
    requestId: string;
    appId: string;
    requesterId: string;
    reason: string;
  }): Promise<void> {
    console.info("[Notification] New app request", params);
  }

  async notifyRequesterApproved(params: {
    requestId: string;
    requesterId: string;
    appId: string;
  }): Promise<void> {
    console.info("[Notification] App request approved", params);
  }

  async notifyRequesterRejected(params: {
    requestId: string;
    requesterId: string;
    appId: string;
    rejectionReason: string;
  }): Promise<void> {
    console.info("[Notification] App request rejected", params);
  }
}

export const notificationService = new NotificationService();
