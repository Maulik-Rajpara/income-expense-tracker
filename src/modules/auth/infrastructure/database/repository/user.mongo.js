import UserRepository from '../../../domain/repositories/user.repository.js';
import UserModel from '../models/user.model.js';

class UserMongoRepository extends UserRepository {

  async create(userData) {
    const userDocument = new UserModel(userData);
    const savedUser = await userDocument.save();
    // Return user without password
    return this._sanitizeUser(savedUser);
  }

  async findAll(options = {}) {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search } = options;
    
    const query = {};
    
    // Search by name or email
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    const [users, total] = await Promise.all([
      UserModel.find(query)
        .select('-password -refreshToken -passwordResetToken -passwordResetExpires')
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit)),
      UserModel.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
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
    const user = await UserModel.findById(id)
      .select('-password -refreshToken -passwordResetToken -passwordResetExpires');
    return user;
  }

  async findByEmail(email) {
    return await UserModel.findOne({ email: email.toLowerCase() });
  }

  async findByPhoneNumber(phoneNumber) {
    return await UserModel.findOne({ phoneNumber });
  }

  async findByEmailOrPhone(identifier) {
    return await UserModel.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { phoneNumber: identifier }
      ]
    });
  }

  async update(id, userData) {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id, 
      { ...userData, updatedAt: new Date() }, 
      { new: true, runValidators: true }
    ).select('-password -refreshToken -passwordResetToken -passwordResetExpires');
    return updatedUser;
  }

  async updatePassword(id, hashedPassword) {
    return await UserModel.findByIdAndUpdate(
      id,
      { password: hashedPassword, updatedAt: new Date() },
      { new: true }
    ).select('-password -refreshToken -passwordResetToken -passwordResetExpires');
  }

  async updateRefreshToken(id, refreshToken) {
    return await UserModel.findByIdAndUpdate(
      id,
      { refreshToken },
      { new: true }
    );
  }

  async setPasswordResetToken(id, token, expires) {
    return await UserModel.findByIdAndUpdate(
      id,
      { 
        passwordResetToken: token, 
        passwordResetExpires: expires 
      },
      { new: true }
    );
  }

  async findByPasswordResetToken(token) {
    return await UserModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });
  }

  async clearPasswordResetToken(id) {
    return await UserModel.findByIdAndUpdate(
      id,
      { 
        passwordResetToken: null, 
        passwordResetExpires: null 
      },
      { new: true }
    );
  }

  async delete(id) {
    return await UserModel.findByIdAndDelete(id);
  }

  // Helper method to remove sensitive fields
  _sanitizeUser(user) {
    if (!user) return null;
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;
    delete userObj.passwordResetToken;
    delete userObj.passwordResetExpires;
    return userObj;
  }
}

export default UserMongoRepository;