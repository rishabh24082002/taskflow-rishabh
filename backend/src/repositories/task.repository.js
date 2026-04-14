const db = require('../db/knex');

const createTask = async (data) => {
  const [task] = await db('tasks').insert(data).returning('*');
  return task;
};

const getTasksByProject = async (project_id, filters = {}) => {
  let query = db('tasks').where({ project_id });

  if (filters.status) {
    query = query.andWhere('status', filters.status);
  }

  if (filters.assignee_id) {
    query = query.andWhere('assignee_id', filters.assignee_id);
  }

  return query;
};

const getTaskById = async (id) => {
  return db('tasks').where({ id }).first();
};

const updateTask = async (id, data) => {
  const [task] = await db('tasks')
    .where({ id })
    .update({ ...data, updated_at: db.fn.now() })
    .returning('*');

  return task;
};

const deleteTask = async (id) => {
  return db('tasks').where({ id }).del();
};

const getProjectStatsByStatus = async (project_id) => {
  return db('tasks')
    .select('status')
    .count('* as count')
    .where({ project_id })
    .groupBy('status');
};

const getProjectStatsByAssignee = async (project_id) => {
  return db('tasks as t')
    .leftJoin('users as u', 'u.id', 't.assignee_id')
    .select('t.assignee_id', 'u.name as assignee_name')
    .count('* as count')
    .where('t.project_id', project_id)
    .groupBy('t.assignee_id', 'u.name')
    .orderByRaw('count(*) desc');
};

module.exports = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  getProjectStatsByStatus,
  getProjectStatsByAssignee
};