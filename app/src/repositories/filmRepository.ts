import { PrismaClient } from '@prisma/client';
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

export class FilmRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async save(film: Film, user: User): Promise<Film> {
    const now = new Date();

    const createdFilm = await this.prisma.film.create({
      data: {
        title: film.title,
        description: film.description,
        director: film.director,
        release_year: film.release_year,
        genre: film.genre,
        price: film.price,
        duration: film.duration,
        video_url: film.video_url ?? null,
        cover_image_url: film.cover_image_url ?? null,
        created_at: film.created_at?.toISOString() ?? now.toISOString(),
        updated_at: film.updated_at?.toISOString() ?? now.toISOString(),
        ownerId: user.id,
      },
      include: {
        owner: true,
      },
    });

    return new Film(
      createdFilm.id,
      createdFilm.title,
      createdFilm.description,
      createdFilm.director,
      createdFilm.release_year,
      createdFilm.genre,
      createdFilm.price,
      createdFilm.duration,
      createdFilm.video_url,
      createdFilm.cover_image_url,
      new Date(createdFilm.created_at), 
      new Date(createdFilm.updated_at), 
      createdFilm.ownerId,
    );
  }

  async findById(id: string): Promise<Film | null> {
    const film = await this.prisma.film.findUnique({ where: { id } });
    if (!film) return null;

    return new Film(
      film.id,
      film.title,
      film.description,
      film.director,
      film.release_year,
      film.genre,
      film.price,
      film.duration,
      film.video_url,
      film.cover_image_url,
      new Date(film.created_at), 
      new Date(film.updated_at), 
      film.ownerId,
    );
  }

  async findByTitle(title: string): Promise<Film[]> {
    const films = await this.prisma.film.findMany({ where: { 
      title: {
        contains: title,
        mode: 'insensitive', 
      },
    },
  });
    if (films.length === 0) return [];
  
    return films.map(film => new Film(
      film.id,
      film.title,
      film.description,
      film.director,
      film.release_year,
      film.genre,
      film.price,
      film.duration,
      film.video_url,
      film.cover_image_url,
      new Date(film.created_at), 
      new Date(film.updated_at), 
      film.ownerId,
    ));
  }
  

  async findByDirector(director: string): Promise<Film[]> {
    const films = await this.prisma.film.findMany({ where: { 
      director: {
      contains: director,
      mode: 'insensitive', 
    },
  },
});
    if (films.length === 0) return [];
  
    return films.map(film => new Film(
      film.id,
      film.title,
      film.description,
      film.director,
      film.release_year,
      film.genre,
      film.price,
      film.duration,
      film.video_url,
      film.cover_image_url,
      new Date(film.created_at), 
      new Date(film.updated_at), 
      film.ownerId,
    ));
  }
  

  async findAll(): Promise<Film[]> {
    const films = await this.prisma.film.findMany();
    return films.map(film => new Film(
      film.id,
      film.title,
      film.description,
      film.director,
      film.release_year,
      film.genre,
      film.price,
      film.duration,
      film.video_url,
      film.cover_image_url,
      new Date(film.created_at), 
      new Date(film.updated_at),
      film.ownerId,
    ));
  }

  async update(film: Film): Promise<Film> {
    const updatedFilm = await this.prisma.film.update({
      where: { id: film.id },
      data: {
        title: film.title,
        description: film.description,
        director: film.director,
        release_year: film.release_year,
        genre: film.genre,
        price: film.price,
        duration: film.duration,
        video_url: film.video_url ?? null,
        cover_image_url: film.cover_image_url ?? null,
        updated_at: new Date().toISOString(), 
        ownerId: film.ownerId,
      },
    });

    return new Film(
      updatedFilm.id,
      updatedFilm.title,
      updatedFilm.description,
      updatedFilm.director,
      updatedFilm.release_year,
      updatedFilm.genre,
      updatedFilm.price,
      updatedFilm.duration,
      updatedFilm.video_url,
      updatedFilm.cover_image_url,
      new Date(updatedFilm.created_at), 
      new Date(updatedFilm.updated_at), 
      updatedFilm.ownerId
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.film.delete({ where: { id } });
  }
}
