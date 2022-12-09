// Dependencies ———————————————————————————————————————————————————————
require('dotenv').config
const express = require('express')
const router = express.Router()
const Utils = require('../utils')
const ClassList = require('../sampledata/Classes')

const Class = ClassList.Classes

// POST - Create a class ————————————————————————————————————
router.post('/', Utils.authenticateToken, (req, res) => {
    // Validate request
    if(Object.keys(req.body).length === 0){
        return res.status(400).send({message: "Please provide class details"})
    }
    // Create new class for user
    let newClass = { _id: Class.length+1, name: req.body.name, user: req.user.firstName, day: req.body.day, startTime: req.body.startTime, endTime: req.body.endTime}
    Class.push(newClass)
    return res.status(201).json(newClass)
})


// GET - Get single user class by id ——————————————————————————————————
// Endpoint = /class/:id
router.get('/:id', Utils.authenticateToken, (req, res) => {
    const userClass = (Class.find(userClass => userClass.user === req.user.firstName && userClass._id == req.params.id))
    if(Class.find(userClass => userClass._id == req.params.id && userClass.user != req.user.firstName)){
        return res.status(403).json({
            message: "You are not authorised to access this class"
        })
    }
    if(userClass == undefined){
        return res.status(404).json({
            message: "Class does not exist"
        })
    }
    res.json(userClass)
})


// GET - Get user classes ———————————————————————————————————————
router.get('/', Utils.authenticateToken, (req, res) => {
    const userClasses = (Class.filter(userClass => userClass.user === req.user.firstName))
    if(userClasses == null){
        return res.status(404).json({
            message: "No classes found"
        })
    }
   res.json(userClasses)
})


// DELETE - Delete a class by its user and id —————————————————————————————
router.delete('/:id', Utils.authenticateToken, (req, res) => {
    // Check if the class exists
    const userClass = Class.find(userClass => userClass._id == req.params.id)
    // if class doesn't exist
    if(userClass == undefined){
        // send error response with 404 status
        console.log("Error: Class does not exist")
        return res.status(404).json({
            message: "Class does not exist"
        })
    }
    // Check if user is authorised to delete the class
    if(userClass.user != req.user.firstName){
        return res.status(403).json({
            message: "You are not authorised to delete this class"
        })
    }
    // Delete the class
    const classIndex = (Class.findIndex(userClass => userClass.user === req.user.firstName && userClass._id == req.params.id))
    Class.splice(classIndex, 1)
    res.json({
        message: "The class was deleted successfully"
    })
})


// PUT - Update a class (name) by its user and id ——————————————————————————————————
router.put('/:id', Utils.authenticateToken, (req, res) => {
    // Check if the class exists
    const userClass = Class.find(userClass => userClass._id == req.params.id)
    // if class doesn't exist
    if(userClass == undefined){
        // send error response with 404 status
        console.log("Error: Class does not exist")
        return res.status(404).json({
            message: "Class does not exist"
        })
    }
    // Check if user is authorised to update the class
    if(userClass.user != req.user.name){
        return res.status(403).json({
            message: "You are not authorised to update this class"
        })
    }
    // update the class (name)
    const classIndex = (Class.findIndex(userClass => userClass.user === req.user.firstName && userClass._id == req.params.id))
    if(req.body.name != null){
        Class[classIndex].name = req.body.name
    }
    if(req.body.day != null){
        Class[classIndex].day = req.body.day
    }
    if(req.body.startTime != null){
        Class[classIndex].startTime = req.body.startTime
    }
    if(req.body.endTime != null){
        Class[classIndex].endTime = req.body.endTime
    }
    res.json(Class[classIndex])
})

// Export as router
module.exports = router