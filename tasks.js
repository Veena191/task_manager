const express = require('express');
const { body } = require('express-validator');
const {
  getTasks, getTask, createTask, updateTask, deleteTask, getAnalytics
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const router = express.Router();
router.use(protect);
router.get('/analytics', getAnalytics);
router.route('/')
  .get(getTasks)
  .post([
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('status').optional().isIn(['Todo', 'In Progress', 'Done']).withMessage('Invalid status'),
    body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority')
  ], createTask);
router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);
module.exports = router;