import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../services/userService';
import { verifyJWT } from '../utils/jwtUtil';
import { PrismaClient } from '@prisma/client';
import  { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/user';
import { Film } from '../models/film';

const prisma = new PrismaClient();
const userService = new UserService();

export const register = async (body: any) => {
  try {
    const user = await userService.register(body);
    return NextResponse.json({ status: 'success', data: user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: null || 'Registration failed' }, { status: 400 });
  }
};

export const login = async (body: { username: string; password: string }) => {
  try {
    const token = await userService.login(body.username, body.password);
    return NextResponse.json({
      status: 'success',
      message: 'Login successful',
      data: {
        username: body.username,
        token: token,
      }
    } as const, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message || 'Login failed',
      data: null
    } as const, { status: 400 });
  }
};

export const updateUser = async (id: string, data: any) => {
  try {
    const user = await userService.updateUser(id, data);
    return NextResponse.json({ status: 'success', data: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to update film.' }, { status: 400 });
  }
};

export const deleteUser = async (id: string) => {
  try {
    await userService.deleteUser(id);
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to delete film.' }, { status: 400 });
  }
};

export const getAllUsers = async () => {
  try {
    const films = await userService.getAllUsers();
    return NextResponse.json({ status: 'success', data: films }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to fetch films.' }, { status: 400 });
  }
};

export const getbyUsername = async (user:string) => {
  try {
    const films = await userService.findByUsername(user);
    return NextResponse.json({ status: 'success', data: films }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to fetch user.' }, { status: 400 });
  }
};

export const searchbyUsername = async (user:string) => {
  try {
    const films = await userService.SearchByUsername(user);
    return NextResponse.json({ status: 'success', data: films }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to fetch user.' }, { status: 400 });
  }
};

export const getbyId = async (user:string) => {
  try {
    const films = await userService.findById(user);
    return NextResponse.json({ status: 'success', data: films }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to fetch user.' }, { status: 400 });
  }
};

export const getSelf = async (request: NextRequest) => {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'No token provided', data: null },
        { status: 401 }
      );
    }

    const decodedToken = verifyJWT(token);

    if (!decodedToken || typeof decodedToken !== 'object' || !('id' in decodedToken)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid token', data: null },
        { status: 401 }
      );
    }

    const userId = (decodedToken as JwtPayload).id;
    if (!userId) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid token', data: null },
        { status: 401 }
      );
    }

    const user = await userService.findById(userId);
    if (!user) {
      return NextResponse.json(
        { status: 'error', message: 'User not found', data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: 'User retrieved successfully',
      data: {
        username: user.username,
        token: token, 
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Internal server error', data: null },
      { status: 500 }
    );
  }
};

export const getUser = async (request: NextRequest) => {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'No token provided', data: null },
        { status: 401 }
      );
    }

    const decodedToken = verifyJWT(token);

    if (!decodedToken || typeof decodedToken !== 'object' || !('id' in decodedToken)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid token', data: null },
        { status: 401 }
      );
    }

    const userId = (decodedToken as JwtPayload).id;
    if (!userId) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid token', data: null },
        { status: 401 }
      );
    }

    const user = await userService.findById(userId);
    if (!user) {
      return NextResponse.json(
        { status: 'error', message: 'User not found', data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: 'User retrieved successfully',
      data: {
        id: user.id,
        username: user.username,
        email: user.email, 
        balance: user.balance
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Internal server error', data: null },
      { status: 500 }
    );
  }
};

export const getUser2 = async (request: NextRequest) => {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'No token provided', data: null },
        { status: 401 }
      );
    }

    const decodedToken = verifyJWT(token);

    if (!decodedToken || typeof decodedToken !== 'object' || !('id' in decodedToken)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid token', data: null },
        { status: 401 }
      );
    }

    const userId = (decodedToken as JwtPayload).id;
    if (!userId) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid token', data: null },
        { status: 401 }
      );
    }

    const user = await userService.findById(userId);
    if (!user) {
      return NextResponse.json(
        { status: 'error', message: 'User not found', data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: 'User retrieved successfully',
      data: {
        id: user.id,
        username: user.username,
        email: user.email, 
        balance: user.balance
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Internal server error', data: null },
      { status: 500 }
    );
  }
};


export async function getUserFromToken(token: string) {
  try {
    const decodedToken = verifyJWT(token);
    console.log(decodedToken)
  
    const userId = (decodedToken as JwtPayload).id;
    console.log(userId)

    const user = await userService.findById(userId);
    console.log(user)

    return user;
  } catch (error) {
    console.error('Failed to authenticate user:',token);
    return null;
  }
}


export async function updateBalanceBuy(user: User, film: Film) {
  try {
    const users = await userService.updateBalance(user,film);
    console.log(users)

    return NextResponse.json({
      status: 'success',
      message: 'User retrieved successfully',
      data: {
        id: users.id,
        username: users.username,
        email: users.email, 
        balance: users.balance
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Internal server error', data: null },
      { status: 500 }
    );
  }
}

export async function purchaseFilm(user: User, film: string) {
  try {
    const users = await userService.purchaseFilm(user,film);
    console.log(users)

   return users;
  } catch (error) {
   return [];
  }
}

export async function purchasedFilms(user: User) {
  try {
    const users = await userService.purchasedFilms(user);
    console.log(users)
   return users;
  } catch (error) {
   return [];
  }
}

export async function updateUserBalance(id: string, increment: number) {
  return prisma.user.update({
    where: { id },
    data: {
      balance: {
        increment,
      },
    },
  });
}

export async function addBookmark(user: User, film: string) {
  try {
    const users = await userService.addBookmark(user, film);
    console.log(users)
   return users;
  } catch (error) {
   return [];
  }
}

export async function getBookmark(user: User) {
  try {
    const users = await userService.getBookmark(user);
    console.log(users)
   return users;
  } catch (error) {
   return [];
  }
}

export async function isBookmarked(user: User, film: string) {
  try {
    const users = await userService.isBookmarked(user, film);
   return users;
  } catch (error) {
   return false;
  }
}

export async function deleteBookmarked(user: User, film: string) {
  try {
    const existingBookmark = await userService.getBookmarkId(user, film);
    if (existingBookmark) {
      await userService.deleteBookmarked(existingBookmark);
      return NextResponse.json(null, { status: 204 });
    } 
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to delete film.' }, { status: 400 });
  }
}

export async function getBookmarkId(user: User, film: string) {
  try {
    const existingBookmark = await userService.getBookmarkId(user, film);
    console.log(existingBookmark)
    
    return NextResponse.json({ status: 'success', data: existingBookmark }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed' }, { status: 400 });
  }
}

