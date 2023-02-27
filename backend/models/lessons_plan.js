import mongoose from "mongoose";
const {default: {PHYSICS_COURSES}} = await import("../config/constants.js");
const Schema = mongoose.Schema;


const brief_lesson = Schema({
    // _id
    title: {type: String},
}, {versionKey: false});

const lessons_list = {};
PHYSICS_COURSES.forEach(i => lessons_list[`course_${i}`] = [brief_lesson])

const lessons_plan_schema = Schema({
    ...lessons_list,
    unused: [brief_lesson]
}, {versionKey: false});


export default mongoose.model("lessons_plan", lessons_plan_schema, "lessons_plan");