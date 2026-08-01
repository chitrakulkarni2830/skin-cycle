import { ProductService } from '../services/productService.js';

export class ProductController {
  static async getProducts(req, res, next) {
    try {
      const result = await ProductService.getProducts(req.query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      res.status(200).json({ product });
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req, res, next) {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json({ product });
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req, res, next) {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body);
      res.status(200).json({ product });
    } catch (error) {
      next(error);
    }
  }
}
