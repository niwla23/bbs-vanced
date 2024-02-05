import { browser } from "$app/environment";
import { redirect, type Cookies } from "@sveltejs/kit";
import JsCookie from "js-cookie";
import { getAuthenticatedPocketBase } from "./clientAuth";

export interface Settings {
  className: string;
  courses: string[];
}

export async function getSettings(cookies?: Cookies) {
  if (browser && localStorage.getItem("hasPro") == "true") {
    const pb = await getAuthenticatedPocketBase()
    if (!pb.authStore.model) {
      console.error("no model")
      return
    }
    const user = await pb.collection("users").getOne(pb.authStore.model.id)
    if (user.settings) {
      return user.settings
    }
  }

  let encoded = undefined
  // server function will inject cookies
  if (cookies) {
    encoded = cookies.get("settings")
  } else {
    encoded = JsCookie.get('settings');
  }

  if (!encoded) {
    if (browser) encoded = localStorage.getItem("settings")
    if (!encoded) return;
  }
  const data: Settings = JSON.parse(encoded);
  await saveSettings(data)

  return data
}

export async function saveSettings(settings: Settings) {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 10);
  JsCookie.set('settings', JSON.stringify(settings), {
    expires: expiryDate,
    secure: false,
    sameSite: 'lax'
  });
  if (browser) localStorage.setItem("settings", JSON.stringify(settings))
  if (browser && localStorage.getItem("hasPro") == "true") {
    const pb = await getAuthenticatedPocketBase()
    if (!pb.authStore.model) {
      console.error("no model")
      return
    }
    await pb.collection("users").update(pb.authStore.model.id, { settings: JSON.stringify(settings) })
  }
}

export async function settingsToJson(cookies?: Cookies) {
  const settings = await getSettings(cookies)
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


export async function checkSettings(cookies: Cookies) {
  const settings = await getSettings(cookies)
  if (!settings) {
    throw redirect(307, `/tour`);
  }

  if (!areSettingsComplete(settings)) {
    throw redirect(307, `/settings`);
  }
}
