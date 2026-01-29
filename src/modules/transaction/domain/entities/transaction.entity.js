class Transaction {
  constructor({ type, categoryId, amount, date, notes, userId, createdAt, updatedAt }) {
    this.type = type; // 'income' or 'expense'
    this.categoryId = categoryId;
    this.amount = amount;
    this.date = date;
    this.notes = notes;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export default Transaction;
