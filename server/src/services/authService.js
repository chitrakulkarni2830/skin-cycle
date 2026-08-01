import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors.js';

export class AuthService {
  static async register(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new ConflictError('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });

    const token = this.generateToken(user._id, user.role);
    
    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, token };
  }

  static async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = this.generateToken(user._id, user.role);
    
    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, token };
  }

  static async getMe(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  static generateToken(id, role) {
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';
    return jwt.sign({ id, role }, secret, { expiresIn: '7d' });
  }
}
