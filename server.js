// Dependencies ——————————————————————————————————————————————————
require('dotenv').config()
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const fileUpload = require('express-fileupload');

// connect to MongoDB database ————————————————————————————————————
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("db connected!"))
.catch(err => console.error("db connection failed", err))

// Express app set up —————————————————————————————————————————————
const app = express();
app.use(express.json());
app.use('*', cors());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
  }))

// Routes —————————————————————————————————————————————————————————
// homepage
app.get('/', (req, res) => {
    res.send('Homepage');
});

// user
const userRouter = require('./routes/user')
app.use('/user', userRouter)

// auth
const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

// class
const classRouter = require('./routes/class')
app.use('/class', classRouter)

// assignment
const assignmentRouter = require('./routes/assignment')
app.use('/assignment', assignmentRouter)

// task
const taskRouter = require('./routes/task')
app.use('/task', taskRouter)

// Run app listen on PORT —————————————————————————————————————————
app.listen(PORT, ()=>{
    console.log(`App running on Port ${PORT}`);
})