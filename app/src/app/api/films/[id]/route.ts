import { getfilmbyID } from '../../../../controllers/filmController';
import { getUserFromToken, purchaseFilm, updateBalanceBuy } from '../../../../controllers/userController';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const id = new URL(request.url).pathname.split('/').pop();

  if (id) {
    const response = await getfilmbyID(id);
    const film = await response.json();  
    return NextResponse.json(film);
  } 

  return NextResponse.json({ error: 'Film ID is required' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const filmId = new URL(request.url).pathname.split('/').pop();
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Authorization header missing or invalid' }, { status: 401 });
    }

    if (!filmId) {
      return NextResponse.json({ error: 'Invalid film Id' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    const filmResponse = await getfilmbyID(filmId);
    const film = await filmResponse.json(); 

    if (!film) {
      return NextResponse.json({ error: 'Film not found' }, { status: 404 });
    }

    if (film.status === 'error') {
      return NextResponse.json({ error: 'Film not found' }, { status: 404 });
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const purchaseData = await purchaseFilm(user, filmId);

    if (purchaseData?.length > 0) {
      return NextResponse.json({ error: 'You have already purchased this film' }, { status: 400 });
    }

    const filmPrice = film.data.price;
    const userBalance = user.balance;

    if (userBalance < filmPrice) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }
    console.log(filmPrice,userBalance)

    await updateBalanceBuy(user, film.data);

    return NextResponse.json({ message: 'Film purchased successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error purchasing film:', error);
    return NextResponse.json({ error: 'An error occurred while purchasing the film' }, { status: 500 });
  }
}
