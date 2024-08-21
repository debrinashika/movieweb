import { getSelf } from '../../../controllers/userController';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return getSelf(request);
}
