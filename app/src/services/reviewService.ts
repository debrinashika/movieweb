
import { ReviewRepository } from '../repositories/reviewRepository';
import { User } from '../models/user';
import { Review } from '../models/review';

interface reviewData {
    rating: number;
    comment: string;
}

export class ReviewService {
    private reviewRepository: ReviewRepository;
  
    constructor() {
      this.reviewRepository = ReviewRepository.getInstance();
    }
  
    async addReview(review: reviewData, user: User, film:string): Promise<void> {
      return this.reviewRepository.save(review, film, user);
    }
  
    async getReviews(filmId: string): Promise<Review[]> {
      return this.reviewRepository.getReviews(filmId);
    }
  
  }
  