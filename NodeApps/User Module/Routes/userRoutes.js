const express = require('express');
const app = express.Router();
const { validationCheck } = require('./middleware');
const { getUser, regUser, loginUser } = require('../Controller/userController');


app.get('/', getUser);
app.post('/register', validationCheck, regUser);
app.post('/login', validationCheck, loginUser);

module.exports = app;