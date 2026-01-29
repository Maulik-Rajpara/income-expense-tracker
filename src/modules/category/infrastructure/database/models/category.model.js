import mongoose from 'mongoose';

// Category Type Enum
export const CATEGORY_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters']
    },
    type: {
      type: String,
      enum: {
        values: [CATEGORY_TYPES.INCOME, CATEGORY_TYPES.EXPENSE],
        message: 'Category type must be either "income" or "expense"'
      },
      required: [true, 'Category type is required']
    },
    isDefault: {
      type: Boolean,
      default: false,
      index: true // Index for faster queries when filtering default categories
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Compound unique index: name + type (same name can exist for income and expense, but not twice for same type)
categorySchema.index({ name: 1, type: 1 }, { unique: true });

// Index for faster queries
categorySchema.index({ type: 1 });
categorySchema.index({ name: 1 });

// Method to get public JSON
categorySchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    name: this.name,
    type: this.type,
    isDefault: this.isDefault,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export default mongoose.model('Category', categorySchema);
