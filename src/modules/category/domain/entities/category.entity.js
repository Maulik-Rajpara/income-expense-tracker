class Category {
  constructor({ name, type, createdAt, updatedAt }) {
    this.name = name;
    this.type = type; // 'income' or 'expense'
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export default Category;
