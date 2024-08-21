import { PrismaClient } from '@prisma/client';
import { Film } from '../models/film';
import { User } from '../models/user';
import { Bookmark } from '../models/bookmark';

export class BookmarkRepository {
  private prisma: PrismaClient;
  private static instance: BookmarkRepository;

  constructor() {
  this.prisma = new PrismaClient();
  }

  static getInstance(): BookmarkRepository {
    if (!BookmarkRepository.instance) {
      BookmarkRepository.instance = new BookmarkRepository();
    }
    return BookmarkRepository.instance;
  }

  async save(film: string, user: User): Promise<void> {
    try {
      await this.prisma.userFilmBookmarks.create({
        data: {
          user: { connect: { id: user.id } },
          film: { connect: { id: film } },
        },
      });
    } catch (error) {
      console.error('Error creating bookmark:', error);
      throw new Error('Could not create bookmark');
    }
  }
  
  async getUserBookmarks(userId: string): Promise<Film[]> {
    const userWithBookmarks = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        bookmarks: {
          include: {
            film: true, 
          },
        },
      },
    });
  
    return userWithBookmarks?.bookmarks.map((bookmark) => new Film(
      bookmark.film.id,
      bookmark.film.title,
      bookmark.film.description,
      bookmark.film.director,
      bookmark.film.release_year,
      bookmark.film.genre,
      bookmark.film.price,
      bookmark.film.duration,
      bookmark.film.video_url,
      bookmark.film.cover_image_url,
      new Date(bookmark.film.created_at), 
      new Date(bookmark.film.updated_at), 
      bookmark.film.ownerId,
    )) || [];
  }

  async isBookmarked(user: User, film: string): Promise<boolean> {
    const bookmark = await this.prisma.userFilmBookmarks.findUnique({
      where: {
        userId_filmId: {
          userId: user.id,
          filmId: film,
        },
      },
    });

    console.log(bookmark)
    if(bookmark){
      console.log("tess")
    } else{
      console.log("sss")
    }
    return !!bookmark;
  }

  async deleteBookmark(userFilmBookmarks: Bookmark): Promise<any> {
    return this.prisma.userFilmBookmarks.delete({
      where: {
        id: userFilmBookmarks.id,
      },
    });

  }

  async getBookmark(user: User, filmId: string): Promise<Bookmark | null> {
    console.log("Starting getBookmark");
    try {
      console.log("Before Prisma query");
      console.log('User ID:', user.id);
      console.log('Film ID:', filmId);
      const existingBookmark = await this.prisma.userFilmBookmarks.findUnique({
        where: {
          userId_filmId: {
            userId: user.id,
            filmId: filmId,
          },
        },
      });
  
      console.log("After Prisma query");
      console.log("existingBookmark:", existingBookmark);
  
      if (!existingBookmark) {
        console.log("No bookmark found, returning null");
        return null;
      }
  
      console.log("Bookmark found, returning Bookmark object");
      return new Bookmark(
        existingBookmark.id,
        existingBookmark.userId,
        existingBookmark.filmId,
      );
    } catch (error) {
      console.error("Error in getBookmark:", error);
      return null;
    }
  }


}