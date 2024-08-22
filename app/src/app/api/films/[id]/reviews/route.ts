import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken, addBookmark, getBookmarkId, deleteBookmarked } from '../../../../../controllers/userController';
import { getReviews, addReview } from '../../../../../controllers/reviewController';

export async function POST(request: NextRequest){
  try {
    const url = new URL(request.url);        
    const pathname = url.pathname;           
    const segments = pathname.split('/');    
    const filmId = segments.slice(-2, -1)[0]
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Authorization header missing or invalid' }, { status: 401 });
    }

    if (!filmId) {
      return NextResponse.json({ error: 'Invalid film Id' }, { status: 401 });
    }

    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const formData = await request.json();
    const rating = parseInt(formData.rating, 10);
    const comment = formData.comment;

    const reviewData = {
        rating: rating,
        comment: comment,
    };

    await addReview(reviewData, user,filmId)

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add bookmark' }, { status: 500 });
  }
}

export async function GET(request: NextRequest){
    const url = new URL(request.url);        
    const pathname = url.pathname;           
    const segments = pathname.split('/');    
    const filmId = segments.slice(-2, -1)[0]

    if (!filmId) {
      return NextResponse.json({ error: 'Invalid film Id' }, { status: 401 });
    }

    return getReviews(filmId);
 
}