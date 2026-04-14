const taskService = require('../services/task.service');

const getTasks = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      assignee_id: req.query.assignee,
    };

    const tasks = await taskService.getTasks(
      req.params.id,
      req.user.user_id,
      filters
    );

    res.json({ tasks });
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        error: 'validation failed',
        fields: { title: 'is required' },
      });
    }

    const task = await taskService.createTask(
      req.params.id,
      req.user.user_id,
      req.body
    );

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(
      req.params.id,
      req.user.user_id,
      req.body
    );

    res.json(task);
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(
      req.params.id,
      req.user.user_id
    );

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};