import mongoose from "mongoose";
const Schema = mongoose.Schema;

/* 
    Every teacher can answer to student
*/

const Message = new Schema({
    text: {type: String, required: true},
    date: {type: Date, required: true},
    sender: {
        login: {type: String, required: true},
        name: {type: String, required: true},
        surname: {type: String, required: true}   
    }
}, {versionKey: false, _id: false});


const dialog_schema = new Schema({
    _id: {type: String, required: true}, // student login
    messages: [Message],
    last_message: Message,
    is_answered_by_teacher: {type: Boolean},
    is_read_by_student: {type: Boolean},
}, {versionKey: false});

export default mongoose.model("dialogs", dialog_schema);