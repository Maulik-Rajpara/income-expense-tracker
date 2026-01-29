class UserRepository {
  create(user) {}
  findAll() {}
  findById(_id) {}
  update(_id, user) {}
  delete(_id) {}
  findByEmail(email) {}
  findByPhoneNumber(phoneNumber) {}
  findByEmailOrPhone(identifier) {}
  updatePassword(_id, hashedPassword) {}
  updateRefreshToken(_id, refreshToken) {}
  setPasswordResetToken(_id, token, expires) {}
}

export default UserRepository;