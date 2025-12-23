import Task from '../models/task.model.js';
import Audit from '../models/audit.model.js';

export const getTasks = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'user') {
      query.createdBy = req.user.id;
    }

    const tasks = await Task.find(query).populate('createdBy', 'name email').sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Tasks retrieved successfully',
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve tasks', error: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'todo',
      dueDate,
      priority: priority || 'medium',
      createdBy: req.user.id,
    });

    await Audit.create({
      action: 'CREATE',
      taskId: task._id,
      beforeState: null,
      afterState: task.toObject(),
      performedBy: req.user.id,
    });

    const populatedTask = await task.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Task created successfully',
      task: populatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate, priority } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role === 'user' && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const beforeState = task.toObject();

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;
    if (priority) task.priority = priority;

    await task.save();

    await Audit.create({
      action: 'UPDATE',
      taskId: task._id,
      beforeState,
      afterState: task.toObject(),
      performedBy: req.user.id,
    });

    const populatedTask = await task.populate('createdBy', 'name email');

    res.status(200).json({
      message: 'Task updated successfully',
      task: populatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role === 'user' && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    const beforeState = task.toObject();

    await Task.findByIdAndDelete(id);

    await Audit.create({
      action: 'DELETE',
      taskId: task._id,
      beforeState,
      afterState: null,
      performedBy: req.user.id,
    });

    res.status(200).json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
};
