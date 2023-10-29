import PocketBase from "pocketbase"
import { formatDate } from "./exams";

export interface NewsArticle {
  id: string;
  created: string;
  updated: string;
  content: string;
  title: string;
  showtimeStart: string;
  showtimeEnd: string;
}


export async function areNewNewsAvailable() {
  const pb = new PocketBase('https://bbs-backend.noteqr.de');
  pb.autoCancellation(false);
  const result = await pb.collection('news').getFirstListItem(
    pb.filter('showtimeStart <= {:now}', {
      now: formatDate(new Date())
    }),
    {
      requestKey: null,
      sort: '-showtimeStart'
    }
  );

  return result.id != localStorage.getItem('lastNewsId')
}
