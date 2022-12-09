// Dependencies ———————————————————————————————————————————————————————
require('dotenv').config
const express = require('express')
const router = express.Router()
const Utils = require('../utils')
const assignmentsList = require('../sampledata/Assignments')

const Assignment = assignmentsList.Assignments

// POST - Create a single assignment ————————————————————————————————————
router.post('/', Utils.authenticateToken, (req, res) => {
    // Validate request
    if(Object.keys(req.body).length === 0){
        return res.status(400).send({
            message: "Please provide assignment details"
        })
    }
    // Create new assignment for user
    const newAssignment = {
        _id: Assignment.length+1,
        name: req.body.name,
        weighting: req.body.weighting,
        dueDate: req.body.dueDate,
        class: req.body.class,
        user: {
            _id: req.user._id,
            name: req.user.firstName
        }
    }
    Assignment.push(newAssignment)
    return res.status(201).json(newAssignment)
})

// GET - Get assignments by user id ————————————————————————————————————————
router.get('/', Utils.authenticateToken, (req, res) => {
    const userAssignments = (Assignment.filter(userAssignment => userAssignment.user._id == req.user._id))
    if(userAssignments.length === 0){
        return res.status(404).json({
            message: "No assignments found"
        })
    }
    res.json(userAssignments)
})

// GET - Get assignments by class id————————————————————————————————————————
// endpoint = /assignment/class/:id
router.get('/class/:id', Utils.authenticateToken, (req, res) => {
    const classAssignments = Assignment.filter(classAssignment => classAssignment.class._id == req.params.id)
    if(classAssignments.length == 0){
        return res.status(404).json({
            message: "No assignments found"
        })
    }
    else if(classAssignments.filter(assignment => assignment.user._id == req.user._id).length != 0){
        const assignments = classAssignments.filter(assignment => assignment.user._id == req.user._id)
        return res.json(assignments)
    }
    return res.status(403).json({
        message: "Unauthorised"
    })
})

// GET - Get single assignment by id ————————————————————————————————————
// endpoint = /assignment/:id
router.get('/:id', Utils.authenticateToken, (req, res) => {
        // Check if assignment exists
    // If assignment does not exist
    if(Assignment.find(assignment => assignment._id == req.params.id) == undefined){
        return res.status(404).json({
            message: "The assignment does not exist"
        })
    }
    // Else check if user is authorised to get assignment
    // If user is authorised get assignment
    if(Assignment.find(assignment => assignment._id == req.params.id && assignment.user._id == req.user._id) != undefined){
        const assignment = Assignment.find(assignment => assignment._id == req.params.id && assignment.user._id == req.user._id)
        return res.json(assignment)
    }
    // Else send unauthorised message
    return res.status(403).json({
        message: "Unauthorised"
    })
})

// DELETE - Delete a single assignment by id ————————————————————————————————————
// endpoint = /assignment/:id
router.delete('/:id', Utils.authenticateToken, (req, res) => {
    // Check if assignment exists
    const assignment = Assignment.find(assignment => assignment._id == req.params.id)
    // If assignment doesn't exist
    if(assignment == undefined){
        // Send error response with 404 status
        return res.status(404).json({
            message: "Assignment does not exist"
        })
    }
    // Check if user is authorised to delete the assignment
    if(assignment.user._id != req.user._id){
        return res.status(403).json({
            message: "Unauthorised"
        })
    }
    // Delete the assignment
    const assignmentIndex = Assignment.findIndex(assignment => assignment._id == req.params.id)
    Assignment.splice(assignmentIndex, 1)
    res.json({
        message: "The assignment was deleted successfully"
    })
})

// PUT - Update a single assignment by id ————————————————————————————————————————
// endpoint = /assignment/:id
router.put('/:id', Utils.authenticateToken, (req, res) => {
    // Check if the assignment exists
    // if the assignment doesn't exist
    if(Assignment.find(assignment => assignment._id == req.params.id) == undefined){
        // Send error response with 404 status
        return res.status(404).json({
            message: "Assignment does not exist"
        })
    }
    // if the assignment does exist
    // Check if the user is authorised to update the assignment
    // if the user is authorised
    else if(Assignment.find(assignment => assignment._id == req.params.id && assignment.user._id == req.user._id)){
        const assignmentIndex = Assignment.findIndex(assignment => assignment._id == req.params.id && assignment.user._id == req.user._id)
        // Update assignment properties based on request body
        if(req.body.name != null){
            Assignment[assignmentIndex].name = req.body.name
        }
        if(req.body.weighting != null){
            Assignment[assignmentIndex].weighting = req.body.weighting
        }
        if(req.body.dueDate != null){
            Assignment[assignmentIndex].dueDate = req.body.dueDate
        }
        if(req.body.mark != null){
            Assignment[assignmentIndex].mark = req.body.mark
        }
        if(req.body.class != null){
            Assignment[assignmentIndex].class = req.body.class
        }
        // Send updated assignment
        return res.json(Assignment[assignmentIndex])
    }
    else return res.status(403).json({
        message: "Unauthorised"
    })
})

// Export as router
module.exports = router