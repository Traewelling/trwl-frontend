import { getContent, postToApi, putReturnToApi } from "./Helpers";

export default class Notifications {
  static fetchNotifications() {
    return getContent("/notifications");
  }

  static readAll() {
    return postToApi("/notifications/readAll");
  }

  static toggleRead(notificationId) {
    return putReturnToApi(`/notifications/${notificationId}`);
  }

  static getCount() {
    return getContent("/notifications/count");
  }
}
