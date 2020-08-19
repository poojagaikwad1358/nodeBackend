var express = require('express');
const app = express();

const noteRoute = require('./Application/Routes/note.routes');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
    extended: true
}))

require('dotenv').config();
const port = process.env.PORT;

var userRoute = require('./Application/Routes/user.routes');
app.use('/user',userRoute);
app.use('/note',noteRoute);
const database = require('./config/config.database');
database.mongoose;

app.listen(port, () => {
console.log("Server is listening on port " + port);
});