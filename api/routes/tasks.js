const express = require('express');
const router = express.Router();
const db = require('../models');
const { Op } = require("sequelize");
const { Task, User, Project } = db;

//Get all task assigned to the user (all statuses)
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const tasks = await Task.findAll({
            where: {
                assigneeID: userId
            }
        })
        console.log(tasks);
        return res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

//Get all task assigned to the user (status not completed)
router.get('incomplete/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const tasks = await Task.findAll({
            where: {
                assigneeID: userId,
                //status does not equal completed
                status: {
                    [Op.ne]: "completed"
                }
            }
        })
        console.log(tasks);
        return res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all task in a specific project assigned to the user (all status)
router.get('/:projectId/:userId', async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const userId = req.params.userId;
        const tasks = await Task.findAll({
            where: {
                projectID: projectId,
                assigneeID: userId
            }
        })
        console.log(tasks);
        return res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }   
});

//Get all task for a specific project.

router.get('/:projectId', async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const tasks = await Task.findAll({
            where: {
                projectID: projectId
            }
        })
        console.log(tasks);
        return res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

//Assign a task to a user

router.put('/:taskId/:userId', async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const userId = req.params.userId;
        const task = await Task.findByPk(taskId);
        task.assigneeID = userId;
        await task.save();
        return res.status(200).json(task);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

//Change the status of a task

router.patch('/:taskId/status', async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const status = req.body.status;
        const task = await Task.findByPk(taskId);
        task.status = status;
        await task.save();
        return res.status(200).json(task);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

//Add a new task

router.post('/', async (req, res) => {
    try {
        const newTask = req.body;
        const task = await Task.create(newTask);
        return res.status(200).json(task);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;