import { NextRequest, NextResponse } from 'next/server';
import { login } from '../../../../controllers/userController';
import { setCORSHeaders } from '../../../lib/cors';

export async function POST(request: NextRequest) {
  
  const body = await request.json();

  let response: NextResponse = await login(body);
  response = setCORSHeaders(response, 'https://labpro-fe.hmif.dev');

  return response;
}

export async function OPTIONS() {
  const response = NextResponse.json({});
  return setCORSHeaders(response, 'https://labpro-fe.hmif.dev');
}
