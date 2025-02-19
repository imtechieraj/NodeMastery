const bcrypt = require('bcrypt');
const { studentCollection } = require('../Models/dbschema');
const async = require('async');
const bunyan = require('bunyan');
const path = require("path");
const jwt = require('jsonwebtoken');

const log =  bunyan.createLogger({
    name: "UserModule",
    streams: [
        {
            level: "info", // Log level
            path: path.join(__dirname, "logs/app.log"), // Log file path
        },
        {
            level: "error",
            path: path.join(__dirname, "logs/error.log"),
        },
    ],
});



const getUser = (req, res) => {
    studentCollection.find({}, { password: 0 }).then((data) => {
        res.send({ status: true, data });
    }).catch((error) => {
        res.status(500).send({ status: false, message: "Internal server error" });
    });
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
            log.info(req.body);
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
                id: arg2._id,
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

const updateUser = (req, res) => {
    let { id } = req.headers;
    studentCollection.updateOne({ _id: id }, { $set: req.body }).then((result) => {
        res.status(200).send({ status: true, message: "Updated" });
    }).catch((error) => {
        res.status(500).send({ status: false, message: "Internal server error" });
    })
    console.log("controller here")
}

const deleteUser = (req, res) => {
    let { id } = req.headers;
    studentCollection.deleteOne({ _id: id }).then((result) => {
        res.status(200).send({ status: true, message: "Deleted" });
    }).catch((error) => {
        res.status(500).send({ status: false, message: "Internal server error" });
    })
}

module.exports = {
    getUser,
    regUser,
    loginUser,
    updateUser,
    deleteUser
}