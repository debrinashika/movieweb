import { NextResponse,NextRequest } from 'next/server';
import { getSelf, register, login } from '../../controllers/userController';

export async function POST(request: Request) {
  const path = new URL(request.url).pathname;
  const body = await request.json();

  if (path.endsWith('/register')) {
    return register(body);
  } else if (path.endsWith('/login')) {
    return login(body);
  } else {
    return NextResponse.json({ status: 'error', message: 'Invalid endpoint' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  return getSelf(request);
}
