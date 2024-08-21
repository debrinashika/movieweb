// /api/admin/self/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSelf } from '../../../../controllers/userController';
import { setCORSHeaders } from '../../../lib/cors';

export async function OPTIONS(request: NextRequest) {
  return setCORSHeaders(new NextResponse(null, { status: 204 }), 'https://labpro-fe.hmif.dev');
}

export async function GET(request: NextRequest) {
  let response: NextResponse = await getSelf(request);
  response = setCORSHeaders(response, 'https://labpro-fe.hmif.dev');

  return response;
}
