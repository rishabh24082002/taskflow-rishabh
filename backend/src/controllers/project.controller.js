const projectService = require('../services/project.service');

const getProjects = async (req, res, next) => {
    try {
        const projects = await projectService.getProjects(
            req.user.user_id,
            req.query
        );
        res.json({ projects });
    } catch (err) {
        next(err);
    }
};

const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        error: 'validation failed',
        fields: { name: 'is required' },
      });
    }

    const project = await projectService.createProject({
      name,
      description,
      owner_id: req.user.user_id,
    });

    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const data = await projectService.getProjectDetails(
      req.params.id,
      req.user.user_id
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(
      req.params.id,
      req.user.user_id,
      req.body
    );

    res.json(project);
  } catch (err) {
    next(err);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    await projectService.deleteProject(
      req.params.id,
      req.user.user_id
    );

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const getProjectStats = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.user_id;

    const stats = await projectService.getProjectStats(projectId, userId);
    return res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectStats,
};