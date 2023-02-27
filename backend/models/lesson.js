import mongoose from "mongoose";
const Schema = mongoose.Schema;

const lessons_schema = Schema({
    // _id
    chapter: {type: String, required: true},
    title: {type: String, required: true},
    text: {type: String, required: true},
    test: {
        type: [Schema({
            question: {type: String},
            correct_answer: {type: String},
            answers: [String]
        }, {versionKey: false, _id: false})],
        default: () => undefined
    },
    lab:{ 
        type: Schema({
            id: {type: String},
            name: {type: String},
            auto_check: [
                {
                    question_type: {type: String}, // quiz, text_answer
                    question: {type: String},
                    correct_answer: {type: String},
                    answers: {type: [String], default: () => undefined}
                }
            ]
        }, {versionKey: false, _id: false}),
        default: () => undefined
    }

}, {versionKey: false});

export default mongoose.model("lessons", lessons_schema);