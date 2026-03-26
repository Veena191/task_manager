const Task = require('../models/Task');
const { validationResult } = require('express-validator');
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
    const query = { user: req.user.id };
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.title = { $regex: search, $options: 'i' };
    const sortObj = {};
    sortObj[sortBy] = order === 'asc' ? 1 : -1;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));
    res.json({
      success: true,
      count: tasks.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      tasks
    });
  } catch (err) {
    next(err);
  }
};
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, task });
  } catch (err) {
    next(err);
  }
};
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    const task = await Task.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, task });
  } catch (err) {
    next(err);
  }
};
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.json({ success: true, task });
  } catch (err) {
    next(err);
  }
};
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    await task.deleteOne();
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
};
const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [total, completed, inProgress, todo, byPriority, overdue] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, status: 'Done' }),
      Task.countDocuments({ user: userId, status: 'In Progress' }),
      Task.countDocuments({ user: userId, status: 'Todo' }),
      Task.aggregate([
        { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(userId.toString()) } },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      Task.countDocuments({
        user: userId,
        status: { $ne: 'Done' },
        dueDate: { $lt: new Date() }
      })
    ]);
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const priorityStats = { Low: 0, Medium: 0, High: 0 };
    byPriority.forEach(p => { priorityStats[p._id] = p.count; });
    res.json({
      success: true,
      analytics: {
        total,
        completed,
        inProgress,
        todo,
        overdue,
        completionPercentage,
        priorityStats
      }
    });
  } catch (err) {
    next(err);
  }
};
module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, getAnalytics };