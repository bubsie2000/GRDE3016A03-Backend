// Dependencies ———————————————————————————————————————————————————————
require('dotenv').config
const express = require('express')
const router = express.Router()
const Utils = require('../utils')
const User = require('./../models/User')

// GET - Get all users ———————————————————————————————————————————————
router.get('/', (req, res) => {
    res.json(User)
})

// POST - Create new user  —————————————————————————————————————————
router.post('/', async (req, res) => {
    // if(!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password){
    if(Object.keys(req.body).length === 0){
        return res.status(400).send({message: "Please provide sign up details"})
    }

    // check that there isn't an existing account with the email
    User.findOne({email: req.body.email})
    .then(user => {
        if(user != null){
            return res.status(400).json({
                message: "Email is already in use. Use a different email address"
            })
        }
    // create new user
    let newUser = new User(req.body)
    newUser.save()
        .then(user => {
            // If successful return 201 status with user object
            return res.status(201).json(user)
        })
        .catch(err => {
            console.log(err)
            return res.status(500).send({
                message: "There was a problem creating an account.",
                error: err
            })
        })
    })
    // const hashedPassword = await Utils.hashPassword(req.body.password)
    // let newUser = {
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     email: req.body.email,
    //     password: hashedPassword,
    //     newUser: true
    // }
    // add new user to User
    // User.push(newUser)
    // // return 201 status with user object
    // return res.status(201).json({
    //     user: {
    //         _id: newUser._id,
    //         firstName: newUser.firstName,
    //         lastName: newUser.lastName,
    //         email: newUser.email,
    //         new: newUser.new,
    //     }
    // })
})

// DELETE - Delete user ———————————————————————————————————————————————
router.delete('/:id', (req, res) => {
    // Check if the user exists
    // const user = User.find(user => user._id == req.user._id)
    User.findById(req.params.id)
    .then(user => {
        // if a user with the id doesn't exist
        if(!user){
            // send an error response with 404 status
            console.log("Error: The user doesn't exist")
            return res.status(404).json({
                message: "The user does not exist"
            })
        }
    })

    // If the user does exist, delete the user using the User model
    User.findByIdAndDelete(req.params.id)
    .then(() => {
        res.json({
            message: "The user has been successfully deleted"
        })
    })
    .catch((err) => {
        console.log("Problem deleting the user.", err)
        // send back 500 status with error message
        res.status(500).json({
            message: "There was a problem deleting the user."
        })
    })
    // if(user == undefined){
    //     return res.status(404).json({
    //         message: "The user does not exist"
    //     })
    // }
    // else
    //     // Check if the user password is correct
    //     if(Utils.verifyHash(req.body.password, user.password)){
    //         // Find the user index
    //         const userIndex = User.findIndex(user => user._id == req.user._id)
    //         // Delete user by index
    //         User.splice(userIndex, 1)
    //         // Inform user that the account has been deleted
    //         return res.json({
    //             message: "The user was deleted successfully"
    //         })
    //     }
    //     else
    //         return res.status(401).json({
    //             message: "Ensure your password is correct"
    //         })
})

// PUT - Update user ———————————————————————————————————————————————
router.put('/', Utils.authenticateToken, (req, res) => {
    // Check if the user exists
    const user = User.find(user => user._id == req.user._id)
    if(user == undefined){
        return res.status(404).json({
            message: "The user does not exist"
        })
    }
    if(Utils.verifyHash(req.body.password, user.password)){
        const userIndex = User.findIndex(user => user._id == req.user._id)
        if(req.body.email != null){
            User[userIndex].email = req.body.email
        }
        if(req.body.name != null){
            User[userIndex].name = req.body.name
        }
        if(req.body.newPassword != null){
            const hashedPassword = Utils.hashPassword(req.body.newPassword)
            User[userIndex].password = hashedPassword
        }
        const accessToken = Utils.generateAccessToken(user)
        return res.json({
            user: User[userIndex],
            accessToken: accessToken
        })
    }
    res.status(401).json({
        message: "Please ensure your password is correct"
    })
})

// Export user route as a router
module.exports = router