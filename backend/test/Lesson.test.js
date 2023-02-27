import Lesson from "../domain/Lesson";
import User from "../domain/User";
import {db_connect} from "../config/db_connection";
import mongoose from "mongoose";
import M_Lesson from "../models/lesson";
import M_LessonsPlan from "../models/lessons_plan.js";
import M_User from "../models/user.js";

const {default: {LESSONS_PLAN_FIELDS}} = await import("../config/constants");

const LESSON = {
    chapter: "Механика",
    title: "Перемещение и траектория",
    text: "Физика - наука о природе"
};

const TEST = [
    {question: "Do you know correct answer?", answers: ["a", "b", "c", "d"], correct_answer: "c"},
    {question: "Do you know correct answer?", answers: ["a", "b", "c", "d"], correct_answer: "a"},
    {question: "Do you know correct answer?", answers: ["a", "b", "c", "d"], correct_answer: "d"},
    {question: "Do you know correct answer?", answers: ["a", "b", "c", "d"], correct_answer: "a"},
    {question: "Do you know correct answer?", answers: ["a", "b", "c", "d"], correct_answer: "b"}
];

const LAB = {
    id: "friction",
    name: "Трение",
    auto_check: [
        {question_type: "quiz", question: "Question", answers: ["a", "b", "c", "d"], correct_answer: "c"},
        {question_type: "quiz", question: "Question", answers: ["a", "b", "c", "d"], correct_answer: "a"},
        {question_type: "quiz", question: "Question", answers: ["a", "b", "c", "d"], correct_answer: "d"},
        {question_type: "text_answer", question: "Question", correct_answer: "2"}
    ]
}

const LESSONS_PLAN = {};
LESSONS_PLAN_FIELDS.forEach(field => LESSONS_PLAN[field] = []);


const deep_clone = (n) => JSON.parse(JSON.stringify(n)); 

beforeAll(async() => await db_connect("school_test"));
afterAll(async() => {
    mongoose.connection.close();
});

afterEach( async() => {
    await M_Lesson.deleteMany({}) 
    await M_LessonsPlan.deleteMany({});
});


describe("create()", () => {
    let lesson;
    beforeEach(async () =>{ 
        lesson = new Lesson();
        await lesson.create_lessons_plan("admin")
    });

    test("text lesson was created successfully", async() => {
        const created_lesson = await lesson.create(LESSON, "teacher");
        expect(created_lesson).toMatchObject(LESSON);
        expect(created_lesson).toHaveProperty("_id");
    });

    test("lesson with test created successfully", async() => {
        const created_lesson = await lesson.create({...LESSON, test: TEST}, "teacher");
        expect(created_lesson).toHaveProperty("test");
        expect(deep_clone(created_lesson.test)).toEqual(TEST);
    });

    test("lesson with lab created successfully", async() => {
        const created_lesson = await lesson.create({...LESSON, lab: LAB}, "teacher");
        expect(created_lesson.lab).toHaveProperty("id");
        expect(created_lesson.lab).toHaveProperty("auto_check");
    });

    test("lessons plan contains new lesson", async() => {
        const created_lesson = await lesson.create(LESSON, "teacher");
        const lessons_plan = await M_LessonsPlan.findOne();
        expect(lessons_plan.unused[0]).toHaveProperty("title", created_lesson.title);
        expect(lessons_plan.unused[0]._id.toString()).toBe(created_lesson._id.toString());
    });
});


describe("update()", () => {
    
    let lesson_id, lesson;

    beforeEach(async()=>{
        lesson = new Lesson();
        await lesson.create_lessons_plan("admin");
        const created_lesson = await lesson.create({...LESSON, test: TEST, lab: LAB}, "teacher");
        lesson_id = created_lesson.id;
    });

    test("chapter field updated successfully", async() => {
        const new_chapter = "Оптика";
        await lesson.update({lesson_id, chapter: new_chapter}, "teacher");
        const updated_lesson = await M_Lesson.findById(lesson_id);
        expect(updated_lesson.chapter).toBe(new_chapter);
    });

    test("lab & test fields resetted successfully", async() => {
        await lesson.update({lesson_id, lab: null, test: null}, "teacher");
        const updated_lesson = await M_Lesson.findById(lesson_id);
        expect(updated_lesson.test).toEqual([]);
        expect(updated_lesson.lab.auto_check).toEqual([]);
        expect(updated_lesson.lab.id).toBeNull();
    });

    test("title field changed also in lessons plan", async() => {
        const new_title = "Передвижение";
        await lesson.update({lesson_id, title: new_title}, "teacher");
        const lessons_plan = await M_LessonsPlan.findOne();
        expect(lessons_plan.unused[0].title).toBe(new_title);
    });
});

describe("get_lesson()", () => {
    let lesson;
    const student = {
        login: "ivan_ivanov", role: "student", password: "123456", course: 7,
        name: "Ivan", surname: "Ivanov", patronymic: "Ivanovich"
    };

    beforeEach(async () =>{ 
        lesson = new Lesson();
        await lesson.create_lessons_plan("admin")
    });

    afterAll(async() => await M_User.deleteMany({}));

    test("lesson received by student", async() => {
        const user = new User();
        await user.create(student, "admin");
        const created_lesson = await lesson.create({...LESSON, test: TEST, lab: LAB}, "teacher");
        await lesson.update_lessons_plan({...LESSONS_PLAN, course_7: [{_id: created_lesson._id, title: created_lesson.title}]}, "teacher");
        const received = await lesson.get_lesson({login: student.login, lesson_id: created_lesson.id}, "student");
        const {chapter, title, text} = LESSON;
        expect(received).toHaveProperty("_id");
        expect(received).toMatchObject({ chapter, title, text });
        expect(deep_clone(received.test)).toEqual(TEST);
        expect(deep_clone(received)).toHaveProperty("lab");
    })

    test("lesson received by teacher", async() => {
        const created_lesson = await lesson.create({...LESSON, test: TEST, lab: LAB}, "teacher");
        const received = await lesson.get_lesson({lesson_id: created_lesson.id}, "teacher");
        const {chapter, title, text} = LESSON;
        expect(received).toHaveProperty("_id");
        expect(received).toMatchObject({ chapter, title, text });
        expect(deep_clone(received.test)).toEqual(TEST);
        expect(deep_clone(received)).toHaveProperty("lab");
    })
});

describe("remove()", () => {
    let lesson, created_lesson;

    beforeEach(async () => { 
        lesson = new Lesson();
        await lesson.create_lessons_plan("admin");
        created_lesson = await lesson.create({...LESSON}, "teacher");
    });

    test("lesson removed", async() => {
        await lesson.remove({lesson_id: created_lesson._id}, "admin");
        const lessons_plan = await M_LessonsPlan.findOne();
        expect(lessons_plan.unused).toEqual([]);
        expect( await M_Lesson.findById(created_lesson._id) ).toBeNull();
    });
});


describe("create_lessons_plan()", () => {
        
    test("lessons plan created", async() => {
        const lesson = new Lesson();
        await lesson.create_lessons_plan("admin");
        const created_lesson_plan = await M_LessonsPlan.findOne();
        expect(created_lesson_plan).toBeTruthy();
    });
});


describe("update_lessons_plan()", () => {
    let lesson, new_lesson, new_plan;
    beforeEach(async()=>{
        lesson = new Lesson();
        await lesson.create_lessons_plan("admin");
        new_lesson = await lesson.create(LESSON, "teacher");
        new_plan = {...LESSONS_PLAN};
    });

    test("lessons plan is updated", async() => {
        new_plan["course_11"].push({_id: new_lesson._id, title: new_lesson.title});
        await lesson.update_lessons_plan(new_plan, "teacher");
        const lessons_plan = await M_LessonsPlan.findOne();
        const {_id, title} = lessons_plan["course_11"][0]; 
        expect(_id.toString()).toBe(new_lesson._id.toString());
        expect(title).toBe(new_lesson.title);
    });

    test("error: wrong new lessons plan struct", async() => {
        delete new_plan["course_11"];
        const create_wrong_struct = async() => await lesson.update_lessons_plan(new_plan, "teacher");
        expect(create_wrong_struct).rejects.toThrow("Wrong new lessons plan struct!");
    });

    test("error: new plan has changed lessons", () => {
        new_plan["course_11"].push({_id: new_lesson._id, title: new_lesson.title + "do title changed"});
        const lesson_title_changed = async() => await lesson.update_lessons_plan(new_plan, "teacher");
        expect(lesson_title_changed).rejects.toThrow("New plan has changed lessons!");
    });
});


describe("finish_lesson()", () => {
    let lesson, user;
    let student;
    
    beforeEach(async () =>{
        user = new User(); 
        lesson = new Lesson();
        await lesson.create_lessons_plan("admin")
        student = {
            login: "ivan_ivanov", role: "student", password: "123456", course: 7,
            name: "Ivan", surname: "Ivanov", patronymic: "Ivanovich"
        };
        await user.create(student, "admin");
    });

    afterEach(async() => await M_User.deleteMany({}));

    test("lesson without test and lab finished", async() => {
        const new_lesson = await lesson.create(LESSON, "teacher");
        await lesson.update_lessons_plan({...LESSONS_PLAN, course_7: [{_id: new_lesson._id, title: new_lesson.title}]}, "teacher");
        const {mistakes, is_lesson_finished} = await lesson.finish_lesson({login: student.login, lesson_id: new_lesson._id}, student.role);
        const updated_student = await M_User.findById(student.login);
        expect(updated_student.watched_lessons).toContain(new_lesson._id.toString());
        expect(mistakes).toBeNull();
        expect(is_lesson_finished).toBe(true);
    });


    test("lesson with test finished", async() => {
        const new_lesson = await lesson.create({...LESSON, test: TEST}, "teacher");
        await lesson.update_lessons_plan({...LESSONS_PLAN, course_7: [{_id: new_lesson._id, title: new_lesson.title}]}, "teacher");
        const test = TEST.map(t => t.correct_answer);
        const finish_info = await lesson.finish_lesson({login: student.login, lesson_id: new_lesson._id, test}, student.role);
        const {mistakes, is_lesson_finished} = finish_info;
        const updated_student = await M_User.findById(student.login);
        expect(updated_student.watched_lessons).toContain(new_lesson._id.toString());
        expect(mistakes).toBeNull();
        expect(is_lesson_finished).toBe(true);
    });


    test("lesson with test not finished because student failed test", async() => {
        const new_lesson = await lesson.create({...LESSON, test: TEST}, "teacher");
        await lesson.update_lessons_plan({...LESSONS_PLAN, course_7: [{_id: new_lesson._id, title: new_lesson.title}]}, "teacher");
        const test = TEST.map(t => "a");
        const finish_info = await lesson.finish_lesson({login: student.login, lesson_id: new_lesson._id, test}, student.role);
        const {mistakes, is_lesson_finished} = finish_info;
        const non_updated_student = await M_User.findById(student.login);
        expect(non_updated_student.watched_lessons).toEqual([]);
        expect(mistakes.test).toEqual([0, 2, 4]);
        expect(is_lesson_finished).toBe(false);
    });

    test("lesson with lab finished", async() => {
        const new_lesson = await lesson.create({...LESSON, lab: LAB}, "teacher");
        await lesson.update_lessons_plan({...LESSONS_PLAN, course_7: [{_id: new_lesson._id, title: new_lesson.title}]}, "teacher");
        const lab = LAB.auto_check.map(l => l.correct_answer);
        const finish_info = await lesson.finish_lesson({login: student.login, lesson_id: new_lesson._id, lab}, student.role);
        const {mistakes, is_lesson_finished} = finish_info;
        const updated_student = await M_User.findById(student.login);
        expect(updated_student.watched_lessons).toContain(new_lesson._id.toString());
        expect(mistakes).toBeNull();
        expect(is_lesson_finished).toBe(true);
    });

    test("lesson with lab not finished because student failed lab's test", async() => {
        const new_lesson = await lesson.create({...LESSON, lab: LAB}, "teacher");
        await lesson.update_lessons_plan({...LESSONS_PLAN, course_7: [{_id: new_lesson._id, title: new_lesson.title}]}, "teacher");
        const lab = LAB.auto_check.map(t => "a");
        const finish_info = await lesson.finish_lesson({login: student.login, lesson_id: new_lesson._id, lab}, student.role);
        const {mistakes, is_lesson_finished} = finish_info;
        const non_updated_student = await M_User.findById(student.login);
        expect(non_updated_student.watched_lessons).toEqual([]);
        expect(mistakes.lab).toEqual([0, 2, 3]);
        expect(is_lesson_finished).toBe(false);
    });

    test("lesson with test and lab finished", async() => {
        const new_lesson = await lesson.create({...LESSON, test: TEST, lab: LAB}, "teacher");
        await lesson.update_lessons_plan({...LESSONS_PLAN, course_7: [{_id: new_lesson._id, title: new_lesson.title}]}, "teacher");
        const lab = LAB.auto_check.map(l => l.correct_answer);
        const test = TEST.map(t => t.correct_answer);
        const finish_info = await lesson.finish_lesson({login: student.login, lesson_id: new_lesson._id, test, lab}, student.role);
        const {mistakes, is_lesson_finished} = finish_info;
        const updated_student = await M_User.findById(student.login);
        expect(updated_student.watched_lessons).toContain(new_lesson._id.toString());
        expect(mistakes).toBeNull();
        expect(is_lesson_finished).toBe(true);
    });
});

describe("get_student_info()", () => {

    afterAll(async() => await M_User.deleteMany({}));
        
    test("student info received", async() => {
        const lesson = new Lesson();
        const user = new User();
        const login = "bondcoder";
        await lesson.create_lessons_plan("admin");
        await user.create({
            login, role: "student", password: "123456", course: 7,
            name: "Ivan", surname: "Ivanov", patronymic: "Ivanovich"}, "admin");
        const student_info = await lesson.get_student_info({login});
        expect(student_info).toHaveProperty("full_name");
        expect(student_info).toHaveProperty("course", 7);
        expect(student_info.watched_lessons).toEqual([]);
        expect(student_info.all_lessons).toEqual([]);
    });
});

describe("get_lessons_plan()", () => {

    test("lessons plan received", async() => {
        const lesson = new Lesson();
        await lesson.create_lessons_plan("admin");
        const received_lessons_plan = await lesson.get_lessons_plan("admin");
        expect(received_lessons_plan).toHaveProperty("_id");
        expect(received_lessons_plan).toHaveProperty("unused");
    });

});



