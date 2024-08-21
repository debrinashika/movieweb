import { getAllFilms } from 'movies/controllers/filmController';

export async function GET() {
  return getAllFilms();
}
