const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' }
            ]
        });
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

// Get single task by ID
exports.getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await prisma.task.findUnique({
            where: { id: parseInt(id) }
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Failed to fetch task' });
    }
};

// Create new task
exports.createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate } = req.body;

        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }

        const task = await prisma.task.create({
            data: {
                title: title.trim(),
                description: description?.trim() || null,
                priority: priority || 'MEDIUM',
                dueDate: dueDate ? new Date(dueDate) : null
            }
        });

        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
};

// Update task
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, dueDate } = req.body;

        const existingTask = await prisma.task.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const task = await prisma.task.update({
            where: { id: parseInt(id) },
            data: {
                title: title?.trim() || existingTask.title,
                description: description?.trim() ?? existingTask.description,
                status: status || existingTask.status,
                priority: priority || existingTask.priority,
                dueDate: dueDate ? new Date(dueDate) : existingTask.dueDate
            }
        });

        res.json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const task = await prisma.task.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        res.json(task);
    } catch (error) {
        console.error('Error updating task status:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(500).json({ error: 'Failed to update task status' });
    }
};

// Delete task
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.task.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(500).json({ error: 'Failed to delete task' });
    }
};

// Get tasks by status
exports.getTasksByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

        if (!validStatuses.includes(status.toUpperCase())) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const tasks = await prisma.task.findMany({
            where: { status: status.toUpperCase() },
            orderBy: { createdAt: 'desc' }
        });

        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks by status:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

// Get tasks by priority
exports.getTasksByPriority = async (req, res) => {
    try {
        const { priority } = req.params;
        const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

        if (!validPriorities.includes(priority.toUpperCase())) {
            return res.status(400).json({ error: 'Invalid priority value' });
        }

        const tasks = await prisma.task.findMany({
            where: { priority: priority.toUpperCase() },
            orderBy: { createdAt: 'desc' }
        });

        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks by priority:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};
