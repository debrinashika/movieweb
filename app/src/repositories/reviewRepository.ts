import { PrismaClient } from '@prisma/client';
import { Review } from '../models/review';
import { User } from '../models/user';

interface reviewData {
    rating: number;
    comment: string;
}

export class ReviewRepository {
  private prisma: PrismaClient;
  private static instance: ReviewRepository;

  constructor() {
  this.prisma = new PrismaClient();
  }

  static getInstance(): ReviewRepository {
    if (!ReviewRepository.instance) {
      ReviewRepository.instance = new ReviewRepository();
    }
    return ReviewRepository.instance;
  }

  async save(review: reviewData, filmId: string, user: User): Promise<void> {
    try {
        console.log('Rating:', review.rating);
        console.log('Comment:', review.comment);
        console.log('User ID:', user.id);
        console.log('Film ID:', filmId);
    
      await this.prisma.review.create({
        data: {
            rating: review.rating,
            comment: review.comment,
            user: { connect: { id: user.id } },
            film: { connect: { id: filmId } },
        },
      });
    } catch (error) {
      console.error('Error creating comment:', error);
      throw new Error('Could not create review');
    }
  }
  
  async getReviews(filmId: string): Promise<Review[]> {
    const userWithBookmarks = await this.prisma.review.findMany({
        where: { filmId:  filmId}
    });
  
    return userWithBookmarks?.map((bookmark) => new Review(
      bookmark.id,
      bookmark.rating,
      bookmark.comment,
      bookmark.userId,
      bookmark.filmId,
      new Date(bookmark.createdAt), 
      new Date(bookmark.updatedAt),
    )) || [];
  }
}