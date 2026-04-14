const express = require('express');
const router = express.Router();

const controller = require('../controllers/task.controller');

router.patch('/:id', controller.updateTask);
router.delete('/:id', controller.deleteTask);

module.exports = router;