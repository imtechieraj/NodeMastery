const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: false
    },
    dynamicData:{
        type:Object,
        required: false
    }
});

const studentCollection = mongoose.model('Student', studentSchema);


module.exports = {
    studentCollection
}
