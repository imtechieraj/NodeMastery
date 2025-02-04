const bcrypt = require('bcrypt');
const { studentCollection } = require('../Models/dbschema');
const async = require('async');
const jwt = require('jsonwebtoken');

const getUser = (req, res) => {

    // Business find, delete
    // res.send('Hello World!')
}

const regUser = (req, res) => {
    async.waterfall([
        (callback) => {
            //email id check
            studentCollection.find({ email: req.body.email }).then((data) => {
                if (data.length > 0) {
                    res.status(409).send({ message: "Email already exist" });
                } else {
                    callback(null, true);
                }
            }).catch((error) => {
                callback(error);
            });
        },
        (arg1, callback) => {
            // hash password
            let { password } = req.body;
            let hassPassword;
            bcrypt.hash(password, 10, function (err, hash) {
                if (err) {
                    console.log(err)
                } else {
                    hassPassword = hash;
                    req.body.password = hassPassword;
                    callback(null, true);
                }
            });
        },
        (arg2, callback) => {
            // final response
            const student = new studentCollection(req.body);
            student.save(req.body).then(() => {
                callback(null, { message: "insert success" })
            }).catch((error) => {
                callback(error);
            });
        }
    ], (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.status(201).send(result);
        }
    });
}

const loginUser = (req, res) => {
    let userDetails;
    async.waterfall([
        (callback) => {
            // step 1: check email id
            studentCollection.find({ email: req.body.email }).then((data) => {
                if (data.length > 0) {
                    userDetails = data[0];
                    callback(null, data[0]);
                } else {
                    res.status(404).send({ message: "Email not found. Please Register" });
                }
            }).catch((error) => {
                callback(error);
            });
        },
        // setp 2: compare password
        (arg1, callback) => {
            bcrypt.compare(req.body.password, arg1.password, function (err, result) {
                if (result) {
                    callback(null, arg1);
                } else {
                    res.status(401).send({ message: "Password not matched" });
                }
            });
        },
        // step 3: generate token
        (arg2, callback) => {
            // generate token
            let token = jwt.sign({
                email: arg2.email
            }, "secretkey", { expiresIn: '1h' });
            callback(null, token);
        },
    ], (err, result) => {
        if (err) {
            res.send(err);
        } else {
            let result2 = { ...userDetails };
            delete result2.password;
            res.status(200).send({ status: true, data: result2, token: result });
        }
    });
}

module.exports = {
    getUser,
    regUser,
    loginUser
}