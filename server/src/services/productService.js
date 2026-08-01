import { Product } from '../models/Product.js';
import { NotFoundError } from '../utils/errors.js';

export class ProductService {
  static async getProducts(query) {
    const { page = 1, limit = 10, category, search } = query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    
    let filter = {};
    if (category) {
      filter.category = category;
    }
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limitNum)
      .lean();
      
    const total = await Product.countDocuments(filter);
    
    return {
      data: products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    };
  }

  static async getProductById(id) {
    const product = await Product.findById(id).lean();
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    return product;
  }

  static async createProduct(productData) {
    const product = await Product.create(productData);
    return product;
  }

  static async updateProduct(id, productData) {
    const product = await Product.findByIdAndUpdate(id, productData, {
      new: true,
      runValidators: true
    });
    
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    
    return product;
  }
}
