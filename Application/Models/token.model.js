var mongoose = require('mongoose')
const tokenSchema = mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'user' 
    },
    token: { 
        type: String, 
        required: true 
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now,
        expires:43200
    }
},{
    timestamps:true
})

module.exports = mongoose.model('token',tokenSchema)