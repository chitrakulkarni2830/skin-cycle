import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors.js';

export const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new UnauthorizedError('Not authorized, no token'));
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';
    const decoded = jwt.verify(token, secret);
    
    // Attach user to request
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    next(new UnauthorizedError('Not authorized, token failed'));
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new UnauthorizedError('User role not authorized to access this route'));
    }
    next();
  };
};
