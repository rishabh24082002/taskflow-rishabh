const express = require('express');
const router = express.Router();

const controller = require('../controllers/project.controller');
const taskController = require('../controllers/task.controller');
const projectController = require('../controllers/project.controller');

router.get('/', controller.getProjects);
router.post('/', controller.createProject);
router.get('/:id', controller.getProjectById);
router.patch('/:id', controller.updateProject);
router.delete('/:id', controller.deleteProject);
router.get('/:id/tasks', taskController.getTasks);
router.post('/:id/tasks', taskController.createTask);
router.get('/:id/stats', projectController.getProjectStats);

module.exports = router;