// Dependencies ———————————————————————————————————————————————————————
require('dotenv').config
const express = require('express')
const router = express.Router()
const Utils = require('../utils')
const TaskList = require('../sampledata/Tasks')

const Tasks = TaskList.Tasks

// POST - Create a single task ——————————————————————————————————
router.post('/', Utils.authenticateToken, (req, res) => {
    // Validate request
    if(Object.keys(req.body).length === 0){
        return res.status(400).send({
            message: "Please provide task details"
        })
    }
    // Create new task for user
    const newTask = {
        _id: Tasks.length+1,
        name: req.body.name,
        status: req.body.status,
        doDate: req.body.doDate,
        dueDate: req.body.dueDate,
        assignment: req.body.assignment,
        class: req.body.class,
        user: {
            _id: req.user._id,
            name: req.user.name
        }
    }
    Tasks.push(newTask)
    return res.status(201).json(newTask)
})

// GET - Get all user tasks ————————————————————————————————————————
router.get('/', Utils.authenticateToken, (req, res) => {
    const userTasks = Tasks.filter(task => task.user._id == req.user._id)
    if(userTasks.length == 0){
        return res.status(404).json({
            message: "No tasks found"
        })
    }
    res.json(userTasks)
})

// GET - Get all user tasks by class id ——————————————————————————————
// endpoint = task/class/:id
router.get('/class/:id', Utils.authenticateToken, (req, res) => {
    const classTasks = Tasks.filter(task => task.class._id == req.params.id)
    if(classTasks.length == 0){
        return res.status(404).json({
            message: "No tasks found"
        })
    }
    else if(classTasks.filter(task => task.user._id == req.user._id).length != 0){
        const tasks = classTasks.filter(task => task.user._id == req.user._id)
        return res.json(tasks)
    }
    return res.status(403).json({
        message: "Unauthorised"
    })
})

// GET - Get all user tasks by assignment id ————————————————————————
// endpoint = task/assignment/:id
router.get('/assignment/:id', Utils.authenticateToken, (req, res) => {
    const assignmentTasks = Tasks.filter(task => task.assignment._id == req.params.id)
    if(assignmentTasks.length == 0){
        return res.status(404).json({
            message: "No tasks found"
        })
    }
    else if(assignmentTasks.filter(task => task.user._id == req.user._id).length != 0){
        const tasks = assignmentTasks.filter(task => task.user._id == req.user._id)
        return res.json(tasks)
    }
    return res.status(403).json({
        message: "Unauthorised"
    })
})

// GET - Get single task by id ——————————————————————————————————————
// endpoint = task/:id
router.get('/:id', Utils.authenticateToken, (req, res) => {
    // Check if task exists
    // If task doesn't exist
    if(Tasks.find(task => task._id == req.params.id) == undefined){
        return res.status(404).json({
            message: "The task does not exist"
        })
    }
    // Else check if the user is authorised to get the task
    // If the user is authorised get the task
    if(Tasks.find(task => task._id == req.params.id && task.user._id == req.user._id)){
        const task = Tasks.find(task => task._id == req.params.id && task.user._id == req.user._id)
        return res.json(task)
    }
    // Else send unauthorised message
    return res.status(403).json({
        message: "Unauthorised"
    })
})

// PUT - Update single task by id ————————————————————————————————————
// endpoint = task/:id
router.put('/:id', Utils.authenticateToken, (req, res) => {
    // Check if the task exists
    // If the task doesn't exist
    if(Tasks.find(task => task._id == req.params.id) == undefined){
        // Send error response with 404 status
        return res.status(404).json({
            message: "Task does not exist"
        })
    }
    // If the task does exist
    // Check if the user is authorised to update the task
    // If the user is authorised
    else if(Tasks.find(task => task._id == req.params.id && task.user._id == req.user._id)){
        const taskIndex = Tasks.findIndex(task => task._id == req.params.id && task.user._id == req.user._id)
        // Update task properties based on requests body
        if(req.body.name != null){
            Tasks[taskIndex].name = req.body.name
        }
        if(req.body.status != null){
            Tasks[taskIndex].status = req.body.status
        }
        if(req.body.doDate != null){
            Tasks[taskIndex].doDate = req.body.doDate
        }
        if(req.body.dueDate != null){
            Tasks[taskIndex].dueDate = req.body.dueDate
        }
        if(req.body.assignment != null){
            Tasks[taskIndex].assignment = req.body.assignment
        }
        if(req.body.class != null){
            Tasks[taskIndex].class = req.body.class
        }
        // Send updated task
        return res.json(Tasks[taskIndex])
    }
    else return res.status(403).json({
        message: "Unauthorised"
    })
})

// DELETE - Delete single task by id —————————————————————————————————
// endpoint = task/:id
router.delete('/:id', Utils.authenticateToken, (req, res) => {
    // Check if task exists
    const task = Tasks.find(task => task._id == req.params.id)
    // If task doesn't exist
    if(task == undefined){
        // send error response with 404 status
        return res.status(404).json({
            message: "Task does not exist"
        })
    }
    // Check if user is authorised to delete the task (user is the same as the task's user)
    // If the user isn't authorised
    if(task.user._id != req.user._id){
        return res.status(403).json({
            message: "Unauthorised"
        })
    }
    // Delete the task
    const taskIndex = Tasks.findIndex(task => task._id == req.params.id)
    Tasks.splice(taskIndex, 1)
    res.json({
        message: "The task was deleted successfully"
    })
})

// Export as router
module.exports = router