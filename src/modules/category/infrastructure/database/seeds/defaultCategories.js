import CategoryModel, { CATEGORY_TYPES } from '../models/category.model.js';
import logger from '../../../../../infrastructure/logger/index.js';

/**
 * Predefined Default Categories
 * These will be seeded into the database
 */
const DEFAULT_CATEGORIES = [
  // Income Categories
  { name: 'Salary', type: CATEGORY_TYPES.INCOME },
  { name: 'Freelance', type: CATEGORY_TYPES.INCOME },
  { name: 'Business', type: CATEGORY_TYPES.INCOME },
  { name: 'Investment', type: CATEGORY_TYPES.INCOME },
  { name: 'Rental Income', type: CATEGORY_TYPES.INCOME },
  { name: 'Bonus', type: CATEGORY_TYPES.INCOME },
  { name: 'Gift', type: CATEGORY_TYPES.INCOME },
  { name: 'Other Income', type: CATEGORY_TYPES.INCOME },

  // Expense Categories
  { name: 'Food & Dining', type: CATEGORY_TYPES.EXPENSE },
  { name: 'Transportation', type: CATEGORY_TYPES.EXPENSE },
  { name: 'Shopping', type: CATEGORY_TYPES.EXPENSE },
  { name: 'Bills & Utilities', type: CATEGORY_TYPES.EXPENSE },
  { name: 'Entertainment', type: CATEGORY_TYPES.EXPENSE },
  { name: 'Healthcare', type: CATEGORY_TYPES.EXPENSE },
  { name: 'Education', type: CATEGORY_TYPES.EXPENSE },
  { name: 'Travel', type: CATEGORY_TYPES.EXPENSE },
  { name: 'Personal Care', type: CATEGORY_TYPES.EXPENSE },
  { name: 'Home & Garden', type: CATEGORY_TYPES.EXPENSE },
  { name: 'Insurance', type: CATEGORY_TYPES.EXPENSE },
  { name: 'Taxes', type: CATEGORY_TYPES.EXPENSE },
  { name: 'Other Expense', type: CATEGORY_TYPES.EXPENSE }
];

/**
 * Seed default categories into database
 * This function is idempotent - it won't create duplicates
 * @returns {Promise<Object>} Result object with created and skipped counts
 */
const seedDefaultCategories = async () => {
  try {
    let created = 0;
    let skipped = 0;
    const errors = [];

    for (const categoryData of DEFAULT_CATEGORIES) {
      try {
        // Check if category already exists (using compound unique index)
        const existing = await CategoryModel.findOne({
          name: categoryData.name.trim(),
          type: categoryData.type
        });

        if (existing) {
          // If category exists but isDefault is not set, update it
          if (!existing.isDefault) {
            existing.isDefault = true;
            await existing.save();
            logger.debug(`Updated category "${categoryData.name}" (${categoryData.type}) to default`);
            created++; // Count as created since we updated it
          } else {
            skipped++;
            logger.debug(`Category "${categoryData.name}" (${categoryData.type}) already exists as default, skipping...`);
          }
        } else {
          // Create new category with isDefault flag
          await CategoryModel.create({
            name: categoryData.name.trim(),
            type: categoryData.type,
            isDefault: true // Mark as default category
          });
          created++;
          logger.debug(`Created default category: "${categoryData.name}" (${categoryData.type})`);
        }
      } catch (error) {
        // Handle unique constraint errors gracefully
        if (error.code === 11000) {
          skipped++;
          logger.debug(`Category "${categoryData.name}" (${categoryData.type}) already exists (duplicate key), skipping...`);
        } else {
          errors.push({ category: categoryData.name, error: error.message });
          logger.error(`Error seeding category "${categoryData.name}":`, error);
        }
      }
    }

    const result = {
      success: errors.length === 0,
      created,
      skipped,
      total: DEFAULT_CATEGORIES.length,
      errors: errors.length > 0 ? errors : undefined
    };

    if (created > 0) {
      logger.info(`✅ Seeded ${created} default categories (${skipped} already existed)`);
    } else if (skipped === DEFAULT_CATEGORIES.length) {
      logger.info(`ℹ️  All default categories already exist (${skipped} skipped)`);
    }

    return result;
  } catch (error) {
    logger.error('Error seeding default categories:', error);
    throw error;
  }
};

/**
 * Clear all default categories (use with caution!)
 * This will delete all categories marked as default (isDefault: true)
 * Note: This will only delete categories that are marked as default, not all categories matching names
 */
const clearDefaultCategories = async () => {
  try {
    // Only delete categories that are marked as default
    const result = await CategoryModel.deleteMany({
      isDefault: true
    });
    
    logger.info(`🗑️  Deleted ${result.deletedCount} default categories`);
    return result;
  } catch (error) {
    logger.error('Error clearing default categories:', error);
    throw error;
  }
};

export { seedDefaultCategories, clearDefaultCategories, DEFAULT_CATEGORIES };
