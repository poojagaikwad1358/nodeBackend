"use strict"
const Note = require('../Models/note.models')
var User = require('../Models/user.models')
var userService = require('../Services/user.service')
class NoteService{
   constructor(){}
    async addNote(req,res){
       
        try { 
            var user = await userService.getValidUserById(req.body.userId)
            console.log(user)
            if (!user){
                var note = new Note({
                    title:req.body.title,
                    content:req.body.content,
                    userId:user._id
                })
                var noteResponse = await Note.create(note)
                res.send(noteResponse) 
            }
            else{
                res.status(400).send({ msg: 'note not created' })
            }
        } catch (error) {
            throw new Error(error)
        }
        
        }
    }
    module.exports = NoteService;

    