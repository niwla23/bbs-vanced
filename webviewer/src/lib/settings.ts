import { redirect, type Cookies } from "@sveltejs/kit";
import JsCookie from "js-cookie";

export interface Settings {
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

export function saveSettings(settings: Settings) {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 10);
  JsCookie.set('settings', JSON.stringify(settings), {
    expires: expiryDate,
    secure: false,
    sameSite: 'lax'
  });

}

export function settingsToJson(cookies?: Cookies) {
  const settings = getSettings(cookies)
  return JSON.stringify(settings)
}

export function importSettingsFromJSON(json: string) {
  const newSettings = JSON.parse(json)
  saveSettings(newSettings)
}

export function areSettingsComplete(settings: Settings) {
  if (!settings.className) return false
  // if (!settings.username) return false
  // if (!settings.password) return false
  return true
}


export function checkSettings(cookies: Cookies) {
  const settings = getSettings(cookies)
  if (!settings) {
    throw redirect(307, `/tour`);
  }

  if (!areSettingsComplete(settings)) {
    throw redirect(307, `/settings`);
  }
}
