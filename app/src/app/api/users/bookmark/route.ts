import { NextRequest, NextResponse } from 'next/server';
import { getBookmark, getUserFromToken } from '../../../../controllers/userController';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Authorization header missing or invalid' }, { status: 401 });
    }

    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json({ error: 'User is missing or invalid' }, { status: 401 });
    }

    const purchasedMovies = await getBookmark(user);
    return NextResponse.json(purchasedMovies);
  } catch (error) {
    console.error('Error in GET /api/users/bookmark:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
