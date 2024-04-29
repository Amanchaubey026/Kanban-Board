const express = require('express');
const { todoModel } = require('../models/kanban.schema');
const { auth } = require('../middlewares/auth.middleware');
const { access } = require('../middlewares/access.middleware');
const todoRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API endpoints for managing tasks
 */

/**
 * @swagger
 * /task:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Retrieve tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of tasks per page
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       404:
 *         description: No tasks found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /task/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedTask:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *       - Admin: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedTask:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    Task:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        title:
 *          type: string
 *        description:
 *          type: string
 *        status:
 *          type: string
 */

todoRouter.post('/task', auth, async (req, res) => {
    const { title, description, status } = req.body;
    try {
        const newTask = new todoModel({ title, description, status });
        await newTask.save();
        res.status(201).send({ message: 'Task has been added successfully', task: newTask });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: error.message });
    }
});

todoRouter.get('/task', auth, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const totalCount = await todoModel.countDocuments();
        const totalPage = Math.ceil(totalCount / limit);

        const skip = (page - 1) * limit;

        const allTask = await todoModel.find().skip(skip).limit(limit);

        if (allTask.length === 0) {
            return res.status(404).send({ message: 'No tasks found' });
        }
        res.status(200).send({ tasks: allTask });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: error.message });
    }
});

todoRouter.put('/task/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTask = await todoModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTask) {
            return res.status(404).send({ message: 'Task not found' });
        }
        res.status(200).send({ message: 'Task updated successfully', updatedTask });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: error.message });
    }
});

todoRouter.delete('/task/:id', auth, access('Admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTask = await todoModel.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).send({ message: 'Task not found' });
        }
        res.status(200).send({ message: 'Task deleted successfully', deletedTask });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: error.message });
    }
});

module.exports = {
    todoRouter
};
