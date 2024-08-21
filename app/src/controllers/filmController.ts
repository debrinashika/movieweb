import { NextResponse } from 'next/server';
import { FilmService } from '../services/filmService';
import { User } from '../models/user'; 
import { Film } from '../models/film'; 

const filmService = new FilmService();

export const createFilm = async (
  filmData: {
    title: string;
    description: string;
    director: string;
    release_year: number;
    genre: string[];
    price: number;
    duration: number;
    video_url: string | null;
    cover_image_url: string | null;
  },
  user: User
): Promise<Film> => {
  try {
    const film = await filmService.createFilm(filmData, user);
    console.error('berhasil');
    return film;
  } catch (error) {
    console.error('Error creating film:', error);
    throw new Error('Failed to create film');
  }
};



export const updateFilm = async (id: string, data: any) => {
  try {
    const film = await filmService.updateFilm(id, data);
    return NextResponse.json({ status: 'success', data: film }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to update film.' }, { status: 400 });
  }
};

export const deleteFilm = async (id: string) => {
  try {
    await filmService.deleteFilm(id);
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to delete film.' }, { status: 400 });
  }
};

export const getAllFilms = async () => {
  try {
    const films = await filmService.getAllFilms();
    return NextResponse.json({ status: 'success', data: films }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to fetch films.' }, { status: 400 });
  }
};

export const getAllTitleDirector = async (text:string) => {
  try {
    const films = await filmService.getAllTitleDirectorFilms(text);
    return NextResponse.json({ status: 'success',message: 'Films fetched successfully', data: films }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to fetch films.' }, { status: 400 });
  }
};

export const getfilmbyID = async (text:string) => {
  try {
    const films = await filmService.getFilmbyId(text);
    return NextResponse.json({ status: 'success',message: 'Films fetched successfully', data: films }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to fetch films.' , data:[]}, { status: 400 });
  }
};
