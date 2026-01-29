import mongoose from 'mongoose';
import { CATEGORY_TYPES } from '../../../../category/infrastructure/database/models/category.model.js';

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: {
        values: [CATEGORY_TYPES.INCOME, CATEGORY_TYPES.EXPENSE],
        message: 'Transaction type must be either "income" or "expense"'
      },
      required: [true, 'Transaction type is required'],
      index: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
      index: true
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0']
    },
    date: {
      type: Date,
      required: [true, 'Transaction date is required'],
      index: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Compound indexes for efficient queries
transactionSchema.index({ userId: 1, date: -1 }); // User transactions sorted by date
transactionSchema.index({ userId: 1, categoryId: 1 }); // User transactions by category
transactionSchema.index({ userId: 1, type: 1, date: -1 }); // User transactions by type and date

// Text index for searching notes
transactionSchema.index({ notes: 'text' });

// Method to get public JSON
transactionSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    type: this.type,
    categoryId: this.categoryId,
    amount: this.amount,
    date: this.date,
    notes: this.notes,
    userId: this.userId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export default mongoose.model('Transaction', transactionSchema);
