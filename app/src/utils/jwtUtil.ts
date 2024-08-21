import jwt from 'jsonwebtoken';

const JWT_SECRET = 'labpro2024'; 

export const generateJWT = (user: { id: string, username: string, role: string}): string => {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, {
    expiresIn: '1h', 
  });
};

export const verifyJWT = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
