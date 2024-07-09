const User = require('../models/User');
const Note = require('../models/Note');

const asyncHandler = require('express-async-handler');


// @desc    Get all notes
// @route   GET /api/v1/notes
// @access  Private
const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean();

    // if no notes
    if(!notes?.length) {
        return res.status(404).json({message: "No notes found"});
    }
    
    // Add username to each note before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username }
    }))

    res.json(notesWithUser)
});


// @desc    Create new note
// @route   POST /api/v1/notes
// @access  Private
const createNewNote = asyncHandler(async (req, res) => {
    const {title, text, user} = req.body;

    // confirm data
    if(!user || !title || !text) {
        return res.status(400).json({message: "All fields are required"});
    }

    // check if user exists
    const userObj = await User.findById(user).exec();
    // we use exec() when passing any value in and we do need to return promise 
    // not using lean because we want other methods attached to it as a mongo document

    if(!userObj) {
        return res.status(404).json({message: "User not found"});
    }


    // check for duplicate title
    const duplicate = await Note.findOne({title}).collation({locale: 'en', strength: 2}).lean().exec();

    if(duplicate) {
        return res.status(409).json({message: "Duplicate note title"});
    }

    // create and store new user
    const note = await Note.create({title, text, user});

    if(note) { // created
        return res.status(201).json({message: `New Note created`});
    }else {
        return res.status(400).json({message: "Invalid note data received"});
    }
});

// @desc    Update a note
// @route   PATCH /api/v1/users
// @access  Private
const updateNote = asyncHandler(async (req, res) => {
    const {id, user, title, text, completed} = req.body;

    //console.log(req.body);

    // Confirm data
    if(!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({message: "All fields are required"});
    }

     // Confirm note exists to update
    const note = await Note.findById(id).exec();
    // we use exec() when passing any value in and we do need to return promise 
    // not using lean because we want other methods attached to it as a mongo document


    if(!note) {
        return res.status(404).json({message: "Note not found"});
    }

    // check for duplicate title
    const duplicate = await Note.findOne({title}).collation({locale: 'en', strength: 2}).lean().exec();

    // Allow renaming of the original note 
    if(duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message: "Duplicate Note title"});
    }

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()

    res.json({message: `'${updatedNote.title}' updated`})

});

// @desc    Delete a note
// @route   DELETE /api/v1/notes
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
    const {id} = req.body;

    if(!id) {
        return res.status(400).json({message: "Note ID is required"});
    }

    const note = await Note.findById(id).exec();

    if(!note) {
        return res.status(400).json({message: "Note not found"});
    }

    const result = await note.deleteOne();
    // console.log(result)

    const reply = `Note ${note.title} with ID ${id} deleted`;

    res.json({message: reply});
});


module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
};