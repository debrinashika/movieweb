import { FilmRepository } from '../repositories/filmRepository';
import { Film } from '../models/film';
import { User } from '../models/user';

interface FilmData {
  id: string;
  title: string;
  director: string;
  release_year: number;
  price: number;
  duration: number;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export class FilmService {
  private filmRepository: FilmRepository;

  constructor() {
    this.filmRepository = new FilmRepository();
  }

  async createFilm(filmData: any, user:User): Promise<Film> {
    const film = new Film(
      filmData.id,
      filmData.title,
      filmData.description,
      filmData.director,
      filmData.release_year,
      filmData.genre,
      filmData.price,
      filmData.duration,
      filmData.video_url,
      filmData.cover_image_url,
      filmData.created_at,
      filmData.updated_at,
      filmData.ownerId,
    );

    if (!film.validateTitle() || !film.validateDirector() || !film.validatePrice()) {
      throw new Error('Invalid film data.');
    }

    return this.filmRepository.save(film,user);
  }

  async updateFilm(id: string, filmData: any): Promise<Film> {
    const film = await this.filmRepository.findById(id);
    if (!film) {
      throw new Error('Film not found.');
    }

    film.title = filmData.title || film.title;
    film.description = filmData.description || film.description;
    film.director = filmData.director || film.director;
    film.release_year = filmData.releaseYear || film.release_year;
    film.genre = filmData.genre || film.genre;
    film.price = filmData.price || film.price;
    film.duration = filmData.duration || film.duration;
    film.video_url = filmData.video_url || film.video_url;
    film.cover_image_url = filmData.cover_image_url || film.cover_image_url;

    return this.filmRepository.update(film);
  }

  async deleteFilm(id: string): Promise<void> {
    await this.filmRepository.delete(id);
  }

  async getAllFilms(): Promise<Film[]> {
    return this.filmRepository.findAll();
  }

  async getAllTitleDirectorFilms(title: string): Promise<Film[]> {
    const filmsByTitle = await this.filmRepository.findByTitle(title);
    const filmsByDirector = await this.filmRepository.findByDirector(title);
    
    return filmsByTitle.concat(filmsByDirector);
}

  async getFilmbyId(id: string): Promise<Film |  null> {
    return this.filmRepository.findById(id);

  }

}
