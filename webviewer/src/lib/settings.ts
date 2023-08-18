import type { Cookies } from "@sveltejs/kit";
import JsCookie from "js-cookie";

export interface Settings {
  username: string;
  password: string;
  className: string;
  courses: string[];
}

export function getSettings(cookies?: Cookies) {
  let encoded = undefined
  // server function will inject cookies
  if (cookies) {
    encoded = cookies.get("settings")
  } else {
    encoded = JsCookie.get('settings');
  }
  if (!encoded) {
    return;
  }
  const data: Settings = JSON.parse(encoded);
  return data
}

export function areSettingsComplete(settings: Settings) {
  if (!settings.className) return false
  if (!settings.username) return false
  if (!settings.password) return false
  return true
}
