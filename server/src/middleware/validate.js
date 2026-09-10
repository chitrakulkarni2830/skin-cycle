import { ValidationError } from '../utils/errors.js';

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
  } catch (error) {
    if (error.issues) {
      const message = error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return next(new ValidationError(message));
    }
    return next(error);
  }
  next();
};
