const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        maxlength: [40, 'Title cannot be more than 40 characters']
    },
    text: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    completed: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
});

noteSchema.plugin(AutoIncrement, {
    inc_field: 'ticket', 
    id: 'ticketNums',
    start_seq: 100
});

module.exports = mongoose.model('Note', noteSchema);