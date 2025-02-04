const express = require('express')
const bodyParser = require('body-parser');
const environt_var = require("./Config/index");
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test').then((result)=>{
    console.log("connected")
}).catch((error)=>{
    // console.log(error)
});



require('body-parser-xml')(bodyParser);
require("./Config")

const app = express()


app.use(express.json());
app.use(bodyParser.xml());

app.use(require('./Routes/userRoutes')) // Custom middleware


app.listen(environt_var.port, () => {
    console.log(`Example app listening on port ${environt_var.port}`)
})
