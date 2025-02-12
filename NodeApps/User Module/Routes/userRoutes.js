const express = require('express');
const app = express.Router();
const { validationCheck, tokenVerify } = require('./middleware');
const { getUser, regUser, loginUser, updateUser, deleteUser } = require('../Controller/userController');



app.post('/register', validationCheck, regUser);
app.post('/login', validationCheck, loginUser);
app.post('/getUser', tokenVerify, validationCheck, getUser);
app.put('/updateUser', tokenVerify, validationCheck, updateUser);
app.delete('/deleteUser', tokenVerify, validationCheck, deleteUser);

module.exports = app;