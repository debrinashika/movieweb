import { getUserFromToken } from '../../../controllers/userController';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', ''); 

  if (!token) {
    return NextResponse.json({ error: 'Authorization header missing or invalid' }, { status: 401 });
  }

  const user = await getUserFromToken(token);

  return NextResponse.json(user, { status: 200 });
}
