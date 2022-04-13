import { getContent, putToApi } from "./Helpers";

export default class PrivacyPolicy {
  static getPolicy() {
    return getContent("static/privacy");
  }

  static acceptPolicy() {
    return putToApi("settings/acceptPrivacy");
  }
}
