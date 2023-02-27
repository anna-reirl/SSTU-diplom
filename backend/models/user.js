import mongoose from "mongoose";
const Schema = mongoose.Schema;

const users_schema = Schema({
    _id: String, // login
    role: {type: String, required: true}, // student, teacher, admin
    password: {type: String, required: true},

    // student & teacher options
    email: {type: String},
    full_name: {
        name: {type: String},
        surname: {type: String},
        patronymic: {type: String}
    },
    
    // student options
    course: {type: Number},
    watched_lessons: {  // array of lesson's ids
        type: [String],
        default: () => undefined
    },
}, {versionKey: false});

export default mongoose.model("users", users_schema);