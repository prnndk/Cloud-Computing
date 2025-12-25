const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// GET all tasks
router.get('/', taskController.getAllTasks);

// GET single task by ID
router.get('/:id', taskController.getTaskById);

// POST create new task
router.post('/', taskController.createTask);

// PUT update task
router.put('/:id', taskController.updateTask);

// PATCH update task status
router.patch('/:id/status', taskController.updateTaskStatus);

// DELETE task
router.delete('/:id', taskController.deleteTask);

// GET tasks by status
router.get('/filter/status/:status', taskController.getTasksByStatus);

// GET tasks by priority
router.get('/filter/priority/:priority', taskController.getTasksByPriority);

module.exports = router;
