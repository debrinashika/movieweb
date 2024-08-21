import { ReviewService } from '../services/reviewService';
import { User } from '../models/user';
import { NextResponse } from 'next/server';

const reviewService = new ReviewService();

export async function addReview( reviewData: {
    rating: number;
    comment: string;
  }, user: User, film: string) {
    try {
      const users = await reviewService.addReview(reviewData, user, film);
      console.log(users)
     return users;
    } catch (error) {
     return [];
    }
  }
  
  export async function getReviews(film: string) {
    try {
        const users = await reviewService.getReviews(film);
        console.log('reviwe')
        console.log(users)
        return NextResponse.json({ status: 'success', data: users }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ status: 'error', message: 'Failed' }, { status: 400 });
    }
  }