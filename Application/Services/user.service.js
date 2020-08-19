var User = require('../Models/user.models')
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var eventEmitter = require('../../events/event')
var Token = require('../models/token.model')
var jwt = require('jsonwebtoken')

exports.Signup = async function (req, res) {
   
    var userExist = await User.findOne({
        email: req.body.email
    })
   
    try {
        if (!userExist) {
           
            let user = new User(
                {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                }
            );
           
            await bcrypt.hash(req.body.password, bcrypt.genSaltSync(10), null, async function (err, hash) {
                if (err) {
                    throw err
                }
                else {
                    user.password = hash
                }

                let userRegisteredResponse = await User.create(user);
                
                var token = await new Token({
                     _userId: userRegisteredResponse._id, 
                     token: crypto.randomBytes(16).toString('hex') 
                    });
                   
                await token.save(async function (err) {
                    if (err) {
                        return res.status(500).send({ msg: err.message });
                    }
                    else {
                        let subject = 'Account verification Token';
                        let text = 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + 'localhost:3000' + '\/confirmation\/' + token.token + '\n';
                        eventEmitter.emit('sendEmail', subject, user, text)
                    }
                })
                res.send({ status: userRegisteredResponse.name + ' registered' })
            })   
        }
        else {
            res.status(400).send({ msg: 'The email address you entered is already associated with another account.' })
        }
    } catch (error) {
        res.send(error);
    }
}

exports.getValidUserById = async function (userId) {
    var user = await User.findOne({
    _id: userId,
    isActive: true,
    isDelete: false
    })
    console.log(user)
    return user;
    }

    

exports.confirmAccount = async function(req,res){
    var tokenData = await Token.findOne({
        token:req.params.token
    })
    if(!tokenData){
    return res.send({
        message:'Invalid token passed'
    })
    }
    var userData = await User.findOne({
        _id:tokenData._userId
    })
    if(!userData){
        return res.status(401).send({
        msg: 'user does not exits'
        })
    }
    if(userData.isVerified){
        return res.send({
            msg: 'user is already verified'
        })
    }
    
    userData.isVerified = true
    userData.save()
    .then(()=>{
        return res.send({
            msg: 'account verified succesfully'
        })
    })
    .catch(err=>{
        return res.send(err)
    })
}

exports.login = async function(req,res){
    try{
        var userExists = await User.findOne({
            email:req.body.email
        })
        if(userExists){
            if(bcrypt.compareSync(req.body.password, userExists.password)){
                if(!userExists.isVerified){
                    return res.status(400).send({
                        msg: 'User is not verified'
                    })
                }
                const payload = {
                    email:userExists.email,
                    name:userExists.name
                }
                let token = jwt.sign(payload,process.env.SECRET_KEY,{
                    expiresIn : 1440
                })
                res.send(token)
            }
            else{
                return res.status(401).send({
                    msg : 'wrong password please check'
                })
            }
        }
        else{
            res.status(401).send({
                msg: 'Invalid user email address please check'
            })
        }
    }
    catch(error){
        throw error
    }
}