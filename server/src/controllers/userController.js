import { UserService } from '../services/userService.js';

export class UserController {
  static async getProfile(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserProfile(id, req.user.id, req.user.role);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }

  static async updateSkinProfile(req, res, next) {
    try {
      const { id } = req.params;
      const updatedUser = await UserService.updateSkinProfile(id, req.body, req.user.id, req.user.role);
      res.status(200).json({ user: updatedUser });
    } catch (error) {
      next(error);
    }
  }
}
