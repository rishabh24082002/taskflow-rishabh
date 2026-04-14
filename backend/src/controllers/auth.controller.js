const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'validation failed',
        fields: {
          name: !name ? 'is required' : undefined,
          email: !email ? 'is required' : undefined,
          password: !password ? 'is required' : undefined,
        },
      });
    }

    const user = await authService.register({ name, email, password });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'validation failed',
        fields: {
          email: !email ? 'is required' : undefined,
          password: !password ? 'is required' : undefined,
        },
      });
    }

    const data = await authService.login({ email, password });

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
};