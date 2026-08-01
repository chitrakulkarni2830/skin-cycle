import { AuthService } from '../services/authService.js';

export class AuthController {
  static async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req, res, next) {
    try {
      // req.user will be populated by authMiddleware
      const user = await AuthService.getMe(req.user.id);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
}
