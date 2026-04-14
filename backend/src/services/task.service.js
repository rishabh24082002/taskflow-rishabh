const taskRepo = require('../repositories/task.repository');
const projectRepo = require('../repositories/project.repository');
const db = require('../db/knex');
const AppError = require('../utils/appError');

const createTask = async (project_id, user_id, data) => {
    const project = await projectRepo.getProjectById(project_id);

    if (!project) {
        throw new AppError('not found', 404);
    }

    if (project.owner_id !== user_id) {
        throw new AppError('forbidden', 403);
    }

    return taskRepo.createTask({
        ...data,
        project_id,
        created_by: user_id
    });
};

const getTasks = async (project_id, user_id, filters) => {
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

    return taskRepo.getTasksByProject(project_id, filters);
};

const updateTask = async (task_id, user_id, data) => {
    const task = await taskRepo.getTaskById(task_id);

    if (!task) {
        throw new AppError('not found', 404);
    }

    const project = await projectRepo.getProjectById(task.project_id);

    if (!project) {
        throw new AppError('not found', 404);
    }

    if (
        project.owner_id !== user_id &&
        task.assignee_id !== user_id
    ) {
        throw new AppError('forbidden', 403);
    }

    return taskRepo.updateTask(task_id, data);
};

const deleteTask = async (task_id, user_id) => {
    const task = await taskRepo.getTaskById(task_id);

    if (!task) {
        throw new AppError('not found', 404);
    }

    const project = await projectRepo.getProjectById(task.project_id);

    if (!project) {
        throw new AppError('not found', 404);
    }

    if (
        project.owner_id !== user_id &&
        task.created_by !== user_id
    ) {
        throw new AppError('forbidden', 403);
    }

    await taskRepo.deleteTask(task_id);
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
};