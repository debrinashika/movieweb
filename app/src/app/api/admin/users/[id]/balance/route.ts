import { NextRequest, NextResponse } from 'next/server';
import { updateUserBalance, getbyId } from '../../../../../../controllers/userController';
import { adminMiddleware } from '../../../../../../middlewares/adminMiddleware';
import { setCORSHeaders } from '../../../../../lib/cors';

export async function OPTIONS(request: NextRequest) {
  return setCORSHeaders(new NextResponse(null, { status: 204 }), 'https://labpro-fe.hmif.dev');
}

export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  const id = new URL(request.url).pathname.split('/').at(-2); 

  const authResult = adminMiddleware(token);
  if (!authResult.isAuthorized) {
    return setCORSHeaders(
      NextResponse.json({ status: 'error', message: authResult.message }, { status: authResult.status }),
      'https://labpro-fe.hmif.dev'
    );
  }

  const { increment } = await request.json();
  if (typeof increment !== 'number' || increment <= 0) {
    return setCORSHeaders(
      NextResponse.json({ status: 'error', message: 'Invalid increment value' }, { status: 400 }),
      'https://labpro-fe.hmif.dev'
    );
  }
  
  if (!id) {
    return setCORSHeaders(
      NextResponse.json({ status: 'error', message: 'Invalid ID' }, { status: 400 }),
      'https://labpro-fe.hmif.dev'
    );
  }

  const user = await getbyId(id);
  if (!user) {
    return setCORSHeaders(
      NextResponse.json({ status: 'error', message: 'User not found' }, { status: 404 }),
      'https://labpro-fe.hmif.dev'
    );
  }

  const updatedUser = await updateUserBalance(id, increment);

  return setCORSHeaders(
    NextResponse.json({ status: 'success', message: 'Balance updated', data: updatedUser }),
    'https://labpro-fe.hmif.dev'
  );
}