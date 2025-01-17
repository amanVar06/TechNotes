const User = require('../models/User');
const Note = require('../models/Note');

const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');


// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();
    if(!users?.length) {
        return res.status(404).json({message: "No users found"});
    }
    res.status(200).json(users);
});


// @desc    Create new user
// @route   POST /api/v1/users
// @access  Private
const createNewUser = asyncHandler(async (req, res) => {
    const {username, password, roles} = req.body;

    // confirm data
    if(!username || !password) {
        return res.status(400).json({message: "All fields are required"});
    }

    // check for duplicate username
    // also for check insensitive case
    const duplicate = await User.findOne({username}).collation({locale: 'en', strength: 2}).lean().exec();

    if(duplicate) {
        return res.status(409).json({message: "Username already exists"});
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10); // salt rounds

    const userObject = (!Array.isArray(roles) || !roles.length)
        ? { username, "password": hashedPwd }
        : { username, "password": hashedPwd, roles }

    // create and store new user
    const user = await User.create(userObject);

    if(user) { // created
        res.status(201).json({message: `New User ${username} created`});
    }else {
        res.status(400).json({message: "Invalid user data received"});
    }
});

// @desc    Update a user
// @route   PATCH /api/v1/users
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
    const {id, username, active, password, roles} = req.body;

    //console.log(req.body);

    // Confirm data
    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({message: "All fields are required"});
    }

    const user = await User.findById(id).exec();
    // we use exec() when passing any value in and we do need to return promise 
    // not using lean because we want other methods attached to it as a mongo document


    if(!user) {
        return res.status(404).json({message: "User not found"});
    }

    // check for duplicate username
    const duplicate = await User.findOne({username}).collation({locale: 'en', strength: 2}).lean().exec();
    // logic different here
    // allow updates to the original user

    if(duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message: "Username already exists"});
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if(password) {
        // hash password
        user.password = await bcrypt.hash(password, 10); // salt rounds
    }

    const updatedUser = await user.save();
    res.json({message: `User ${updatedUser.username} updated`})

});

// @desc    Delete a user
// @route   DELETE /api/v1/users
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
    const {id} = req.body;

    if(!id) {
        return res.status(400).json({message: "User ID is required"});
    }

    const note = await Note.findOne({user: id}).lean().exec();

    if(note) {
        return res.status(400).json({message: "User has assigned notes. Please delete notes first"});
    }

    const user = await User.findById(id).exec();
    // console.log(user)

    if(!user) {
        return res.status(404).json({message: "User not found"});
    }

    const result = await user.deleteOne();
    // console.log(result)

    const reply = `Username ${user.username} with ID ${id} deleted`;

    res.json({message: reply});
});


module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
};