import { RoutineService } from '../services/routineService.js';

export class RoutineController {
  static async getRoutines(req, res, next) {
    try {
      const routines = await RoutineService.getRoutines(req.user.id);
      res.status(200).json({ routines });
    } catch (error) {
      next(error);
    }
  }

  static async getRoutineById(req, res, next) {
    try {
      const routine = await RoutineService.getRoutineById(req.params.id, req.user.id);
      res.status(200).json({ routine });
    } catch (error) {
      next(error);
    }
  }

  static async createRoutine(req, res, next) {
    try {
      const routine = await RoutineService.createRoutine(req.user.id, req.body);
      res.status(201).json({ routine });
    } catch (error) {
      next(error);
    }
  }

  static async updateRoutine(req, res, next) {
    try {
      const routine = await RoutineService.updateRoutine(req.params.id, req.user.id, req.body);
      res.status(200).json({ routine });
    } catch (error) {
      next(error);
    }
  }

  static async deleteRoutine(req, res, next) {
    try {
      await RoutineService.deleteRoutine(req.params.id, req.user.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
