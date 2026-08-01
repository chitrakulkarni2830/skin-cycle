import { User } from '../models/User.js';
import { NotFoundError, UnauthorizedError } from '../utils/errors.js';

export class UserService {
  static async getUserProfile(userId, requestUserId, requestUserRole) {
    if (userId !== requestUserId && requestUserRole !== 'admin') {
      throw new UnauthorizedError('Not authorized to access this profile');
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  static async updateSkinProfile(userId, skinProfileData, requestUserId, requestUserRole) {
    if (userId !== requestUserId && requestUserRole !== 'admin') {
      throw new UnauthorizedError('Not authorized to update this profile');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.skinProfile = { ...user.skinProfile, ...skinProfileData };
    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;
    
    return updatedUser;
  }
}
