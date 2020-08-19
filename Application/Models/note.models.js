var mongoose = require('mongoose')
const Schema = mongoose.Schema
const noteSchema = mongoose.Schema({
    title: { type:String },
    content: { 
        type: String, required: true
    },
    userId: { 
        type: Schema.Types.ObjectId, ref: 'user'
    }
},
{
    timestamps:true
})

module.exports = mongoose.model('Note',noteSchema)