const projectRepo = require('../repositories/project.repository');
const taskRepo = require('../repositories/task.repository');
const db = require('../db/knex');
const AppError = require('../utils/appError');

const createProject = async (data) => {
  return projectRepo.createProject(data);
};

const getProjects = async (user_id, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;

  return projectRepo.getProjectsForUser(user_id, { page, limit });
};

const getProjectDetails = async (project_id, user_id) => {
  const project = await projectRepo.getProjectById(project_id);

  if (!project) {
    throw new AppError('not found', 404);
  }

  if (project.owner_id !== user_id) {
    const isAssigned = await db('tasks')
      .where({ project_id, assignee_id: user_id })
      .first();

    if (!isAssigned) {
      throw new AppError('forbidden', 403);
    }
  }

  const tasks = await db('tasks').where({ project_id });

  return { ...project, tasks };
};

const updateProject = async (project_id, user_id, data) => {
  const project = await projectRepo.getProjectById(project_id);

  if (!project) {
    throw new AppError('not found', 404);
  }

  if (project.owner_id !== user_id) {
    throw new AppError('forbidden', 403);
  }

  return projectRepo.updateProject(project_id, data);
};

const deleteProject = async (project_id, user_id) => {
  const project = await projectRepo.getProjectById(project_id);

  if (!project) {
    throw new AppError('not found', 404);
  }

  if (project.owner_id !== user_id) {
    throw new AppError('forbidden', 403);
  }

  await projectRepo.deleteProject(project_id);
};

const getProjectStats = async (project_id, user_id) => {
  const project = await projectRepo.getProjectById(project_id);
  if (!project) throw new AppError('not found', 404);

  if (project.owner_id !== user_id) {
    const hasAnyTask = await db('tasks')
      .where({ project_id })
      .andWhere((qb) => qb.where('assignee_id', user_id).orWhere('created_by', user_id))
      .first();

    if (!hasAnyTask) throw new AppError('forbidden', 403);
  }

  const byStatusRows = await taskRepo.getProjectStatsByStatus(project_id);
  const byAssigneeRows = await taskRepo.getProjectStatsByAssignee(project_id);

  const by_status = { todo: 0, in_progress: 0, done: 0 };
  for (const r of byStatusRows) by_status[r.status] = Number(r.count || 0);

  const by_assignee = byAssigneeRows.map((r) => ({
    assignee_id: r.assignee_id,
    assignee_name: r.assignee_name || null,
    count: Number(r.count || 0),
  }));

  return { project_id, by_status, by_assignee };
};

module.exports = {
  createProject,
  getProjects,
  getProjectDetails,
  updateProject,
  deleteProject,
  getProjectStats,
};