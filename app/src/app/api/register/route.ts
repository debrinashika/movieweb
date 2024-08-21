import { register } from '../../../controllers/userController';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  return register(body);
}
