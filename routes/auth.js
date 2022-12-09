// Dependencies ———————————————————————————————————————————————————————
require('dotenv').config
const express = require('express')
const router = express.Router()
const Utils = require('../utils')
const jwt = require("jsonwebtoken")
const User = require('./../models/User')

// POST - Sign In  —————————————————————————————————————————
router.post('/signin', (req, res) => {
    // 1. check if email and password are empty
    if(!req.body.email || !req.body.password){
        return res.status(400).json({message: "Please provide both an email and a password."})
    }
    // 2. continue to check credentials
    // find the user in the database
    User.findOne({email: req.body.email})
    .then(async user => {
        // if the user doesn't exist
        if(user == null){
            return res.status(400).json({message: 'An account with this email does not exist'})
        }
        // if the user exists, check password
        if(Utils.verifyHash(req.body.password, user.password)){
            // credentials match - generate JWT
            let payload = {
                _id: user._id
            }
            let accessToken = Utils.generateAccessToken(payload)
            // strip password from our user object
            user.password = undefined
            // send back response without password
            return res.json({
                accessToken: accessToken,
                user: user
            })
        }
        else{
            // password didn't match
            return res.status(400).json({
                message: "Password is incorrect"
            })
        }
    })
})

// GET - (Authorisation) Validate token ———————————————————————————————
router.get('/validate', (req, res) => {
    // get token 
    let token = req.headers['authorization'].split(' ')[1];
    if(!token){
        return res.status(400).json({
            message: "Please log in"
        })
    }
    // validate token using jwt
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
        if(err){
            console.log(err)
            return res.status(401).json({
                message: "Unauthorised"
            })
        }
        User.findById(authData._id)
        .then(user => {
            // remove password from user object
            user.password = undefined
            res.json({
                user: user
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "Problem validating token",
                error: err
            })
        })
    })
})

// Export auth route as a router
module.exports = router