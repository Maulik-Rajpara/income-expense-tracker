import CategoryRepository from '../../../domain/repositories/category.repository.js';
import CategoryModel from '../models/category.model.js';

class CategoryMongoRepository extends CategoryRepository {
  async create(categoryData) {
    const categoryDocument = new CategoryModel(categoryData);
    const savedCategory = await categoryDocument.save();
    return savedCategory;
  }

  async findAll(options = {}) {
    const { 
      page = 1, 
      limit = 10, 
      sort = 'createdAt', 
      order = 'desc', 
      search,
      type 
    } = options;
    
    const query = {};
    
    // Filter by type if provided
    if (type) {
      query.type = type;
    }
    
    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    const [categories, total] = await Promise.all([
      CategoryModel.find(query)
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit)),
      CategoryModel.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: categories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  async findById(id) {
    return await CategoryModel.findById(id);
  }

  async findByNameAndType(name, type) {
    return await CategoryModel.findOne({ 
      name: name.trim(), 
      type 
    });
  }

  async findByType(type, options = {}) {
    const { 
      page = 1, 
      limit = 10, 
      sort = 'createdAt', 
      order = 'desc',
      search 
    } = options;
    
    const query = { type };
    
    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    const [categories, total] = await Promise.all([
      CategoryModel.find(query)
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit)),
      CategoryModel.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: categories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  async update(id, categoryData) {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id, 
      { ...categoryData, updatedAt: new Date() }, 
      { new: true, runValidators: true }
    );
    return updatedCategory;
  }

  async delete(id) {
    return await CategoryModel.findByIdAndDelete(id);
  }
}

export default CategoryMongoRepository;
