require('dotenv').config();
const jwt = require('jsonwebtoken');
let crypto = require('crypto');
const uuid = require('uuid');
const path = require('path')

class Utils {
    // Encrypt plain text password
    hashPassword(password){
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
        return [salt, hash].join('$');
    }

    // Verify encrypted password
    verifyHash(password, original){
        const originalHash = original.split('$')[1];
        const salt = original.split('$')[0];
        const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
        return hash === originalHash;
    }

    // Generate access token for user
    generateAccessToken(user){
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '7d'})
    }

    // Autheticate user's access token
    authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        // No token? -> unauthorised
        if(token == null){
            return res.status(401).json({
                message: "Unauthorised no token"
            })
        }

        // Error verifying token? -> unauthorised
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) {
                return res.status(403).json({
                    message: "Unauthorised",
                    error: err
                })
            }
            req.user = user
            next()
        })
    }

    // Upload avatar image file
    uploadFile(file, uploadPath, callback){
        // get file extension (.jpg, .png, etc)
        const fileExtension = file.name.split('.').pop()
        // create unique file name 
        const uniqueFilename = uuid + '.' + fileExtension
        // set upload path (where to store image on server)
        const uploadPathFull = path.join(uploadPath, uniqueFilename)
        // move image to uploadPathFull
        file.mv(uploadPathFull, function(err) {
            if(err){
                console.log(err)
                return false
            }
            if(typeof callback == 'function'){
                callback(uniqueFilename)
            }
        })
    }
}

module.exports = new Utils()