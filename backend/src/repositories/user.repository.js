const db = require('../db/knex');

const createUser = async ({ name, email, password }) => {
  const [user] = await db('users')
    .insert({ name, email, password })
    .returning(['id', 'name', 'email', 'created_at']);

  return user;
};

const getUserByEmail = async (email) => {
  return db('users').where({ email }).first();
};

module.exports = {
  createUser,
  getUserByEmail,
};