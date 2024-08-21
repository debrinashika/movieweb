import jwt from 'jsonwebtoken';

const JWT_SECRET = 'labpro2024'; 

export const adminMiddleware = (token: string | undefined) => {
  if (!token) {
    return { isAuthorized: false, status: 401, message: 'Access Denied. No token provided.' };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as { role: string };
    
    if (decoded.role !== 'admin') {
      return { isAuthorized: false, status: 403, message: 'Access Denied. Admins only.' };
    }
    
    return { isAuthorized: true, user: decoded };
  } catch (error) {
    console.error('Token verification error:', error); 
    return { isAuthorized: false, status: 400, message: 'Invalid token.' };
  }
};
