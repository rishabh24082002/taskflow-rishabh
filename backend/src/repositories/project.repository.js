const db = require('../db/knex');

const createProject = async ({ name, description, owner_id }) => {
  const [project] = await db('projects')
    .insert({ name, description, owner_id })
    .returning('*');

  return project;
};

const getProjectsForUser = async (user_id, { page = 1, limit = 10 }) => {
  const baseQuery = db('projects')
    .leftJoin('tasks', 'projects.id', 'tasks.project_id')
    .where(function () {
      this.where('projects.owner_id', user_id)
          .orWhere('tasks.assignee_id', user_id);
    });

  const totalResult = await baseQuery
    .clone()
    .clearSelect()
    .countDistinct('projects.id as count')
    .first();

  const projects = await baseQuery
    .clone()
    .distinct('projects.*')
    .limit(limit)
    .offset((page - 1) * limit);

  return {
    total: parseInt(totalResult.count),
    page,
    limit,
    data: projects,
  };
};
const getProjectById = async (id) => {
  return db('projects').where({ id }).first();
};

const updateProject = async (id, data) => {
  const [project] = await db('projects')
    .where({ id })
    .update(data)
    .returning('*');

  return project;
};

const deleteProject = async (id) => {
  return db('projects').where({ id }).del();
};


module.exports = {
  createProject,
  getProjectsForUser,
  getProjectById,
  updateProject,
  deleteProject,
};