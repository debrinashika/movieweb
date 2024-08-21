import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers,searchbyUsername, updateUser, deleteUser, getbyId } from '../../../../controllers/userController';
import { adminMiddleware } from '../../../../middlewares/adminMiddleware';
import { setCORSHeaders } from '../../../lib/cors';

export async function OPTIONS(request: NextRequest) {
  return setCORSHeaders(new NextResponse(null, { status: 204 }), 'https://labpro-fe.hmif.dev');
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    const authResult = adminMiddleware(token);

    if (!authResult.isAuthorized) {
      return setCORSHeaders(
        NextResponse.json({ status: 'error', message: authResult.message }, { status: authResult.status }),
        'https://labpro-fe.hmif.dev'
      );
    }

    const url = new URL(request.url);
    const query = url.searchParams.get('q');

    if (query) {
      return setCORSHeaders(await searchbyUsername(query), 'https://labpro-fe.hmif.dev');
    }

    return setCORSHeaders(await getAllUsers(), 'https://labpro-fe.hmif.dev');

  } catch (error) {
    return setCORSHeaders(
      NextResponse.json({ status: 'error', message: 'Failed to process request.' }, { status: 500 }),
      'https://labpro-fe.hmif.dev'
    );
  }
}

export async function PUT(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  const body = await request.json();
  const id = new URL(request.url).pathname.split('/').pop();

  const authResult = adminMiddleware(token);
  if (!authResult.isAuthorized) {
    return setCORSHeaders(
      NextResponse.json({ status: 'error', message: authResult.message }, { status: authResult.status }),
      'https://labpro-fe.hmif.dev'
    );
  }

  if (!id) {
    return setCORSHeaders(
      NextResponse.json({ status: 'error', message: 'Invalid ID' }, { status: 400 }),
      'https://labpro-fe.hmif.dev'
    );
  }

  return setCORSHeaders(await updateUser(id, body), 'https://labpro-fe.hmif.dev');
}

export async function DELETE(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  const id = new URL(request.url).pathname.split('/').pop();

  const authResult = adminMiddleware(token);
  if (!authResult.isAuthorized) {
    return setCORSHeaders(
      NextResponse.json({ status: 'error', message: authResult.message }, { status: authResult.status }),
      'https://labpro-fe.hmif.dev'
    );
  }

  if (!id) {
    return setCORSHeaders(
      NextResponse.json({ status: 'error', message: 'Invalid ID' }, { status: 400 }),
      'https://labpro-fe.hmif.dev'
    );
  }

  return setCORSHeaders(await deleteUser(id), 'https://labpro-fe.hmif.dev');
}
