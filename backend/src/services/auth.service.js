const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/user.repository');
const AppError = require('../utils/appError');

const SALT_ROUNDS = 12;

const signToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new AppError('server misconfigured: JWT_SECRET missing', 500);
  }

  return jwt.sign(
    { user_id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

const register = async ({ name, email, password }) => {
  const existingUser = await userRepo.getUserByEmail(email);

  if (existingUser) {
    throw new AppError('email already exists', 400);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await userRepo.createUser({
    name,
    email,
    password: hashedPassword,
  });

  const token = signToken(user);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

const login = async ({ email, password }) => {
  const user = await userRepo.getUserByEmail(email);

  if (!user) {
    throw new AppError('invalid credentials', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError('invalid credentials', 401);
  }

  const token = signToken(user);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

module.exports = {
  register,
  login,
};