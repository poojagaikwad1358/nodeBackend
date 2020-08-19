const dotenv = require('dotenv')
dotenv.config();
const mongoose = require('mongoose');
const url = process.env.DATABASE

mongoose.connect(url,{
    useNewUrlParser:true
})
.then(()=>{
    console.log('Successfully connected to database.');
})
.catch(err =>{
    console.log('Could not connect to database.'+err);
    process.exit();
})
