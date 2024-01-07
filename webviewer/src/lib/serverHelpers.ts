// place files you want to import through the `$lib` alias in this folder.
import { env } from '$env/dynamic/private';
import PocketBase from 'pocketbase';
export const pb = new PocketBase('https://bbs-backend.noteqr.de');
pb.autoCancellation(false)

interface LogData {
  date: Date
  url: string
  className?: string
  hasPro?: boolean
  cacheAllow?: boolean
  cacheHit?: boolean
}

export async function pbAuth() {
  await pb.collection('users').authWithPassword(env.PB_USER, env.PB_PASSWORD)
}

export async function logEvent(ressource: string, data: LogData) {
  await pbAuth()
  await pb.collection("logs").create({
    ressource,
    environment: env.NODE_ENV,
    ...data
  })
}


export function sendJson(data: any, status?: number) {
  return new Response(JSON.stringify(data), { status: status || 200 })
}
