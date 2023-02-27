import M_Lesson from "../models/lesson.js";
import M_LessonsPlan from "../models/lessons_plan.js";
import M_User from "../models/user.js";
import AlertError from "../lib/AlertError.js";
const {default: {PHYSICS_CHAPTERS, LESSONS_PLAN_FIELDS}} = await import("../config/constants.js");

class Lesson{
    async create(options={}, role){
        if(!["teacher", "admin"].includes(role)) throw new Error("Have not permissions!");
        const {chapter, title, text, test, lab} = options;
        if(!PHYSICS_CHAPTERS.includes(chapter)) throw new Error("Wrong chapter!");
        if(!title || !text) throw new Error("Wrong params!");
        if(title.length > 200) throw new AlertError("Заголовок не может иметь длину свыше 200 символов!");    
        const new_lesson = {chapter, title, text}
        if(test && test.length){
            this._validate_test(test);
            new_lesson.test = test;
        }
        if(lab && lab.id){
            this._validate_lab(lab);
            new_lesson.lab = lab;
        }
        const lessons_plan = await M_LessonsPlan.findOne();
        if(!lessons_plan) throw new Error("Lessons plan does not exist!");
        const added_lesson = await (new M_Lesson(new_lesson)).save();
        lessons_plan.unused.push({_id: added_lesson._id, title });
        await lessons_plan.save();
        return added_lesson;    
    }

    async update(options={}, role){
        if(!["teacher", "admin"].includes(role)) throw new Error("Have not permissions!");
        const {lesson_id, chapter, title, text, test, lab} = options;    
        const lesson = await M_Lesson.findById(lesson_id);
        if(!lesson) throw new Error("Lesson does not exist!");
        const lessons_plan = await M_LessonsPlan.findOne(); 
        if(chapter) { 
            if(!PHYSICS_CHAPTERS.includes(chapter)) throw new Error("Wrong chapter!");
            lesson.chapter = chapter;
        }
        if(title) {
            if(title.length > 200) throw new AlertError("Заголовок не может иметь длину свыше 200 символов!");
            lesson.title = title;
            this._update_lesson_in_lessons_plan({lessons_plan, lesson_id, title});
        }
        if(text) lesson.text = text;
        
        // test
        if(test === null) lesson.test = [];
        else if(test && test.length){
            this._validate_test(test);
            lesson.test = test;
        }

        // lab
        if(lab === null) {
            lesson.lab.id = null;
            lesson.lab.name = null;
            lesson.lab.auto_check = [];
        }
        else if(lab && lab.id){
            this._validate_lab(lab);
            lesson.lab = lab;
        }

        await lesson.save();
        await lessons_plan.save();
    }

    _validate_test(test){
        for(const {question, correct_answer, answers} of test){
            if(!question || !correct_answer || !answers) throw new Error("Wrong question's attributes!");
            if(!answers.includes(correct_answer)) throw new Error("Answers do not contain correct answer!");
        }
    }

    _validate_lab(lab){
        if(!lab.id) throw new Error("Wrong lab id!");
        if(!lab.name) throw new Error("Wrong lab name!");
        for(const {question_type, question, correct_answer, answers} of lab.auto_check){
            if(!correct_answer || !question) throw new Error("Wrong lab question's attributes!");
            if(!["quiz", "text_answer"].includes(question_type)) throw new Error("Wrong question type!");
            if(question_type === "quiz" && !answers.includes(correct_answer))
                throw new Error("Quiz answers do not contain correct answer!");
        }
    }

    async remove(options={}, role){
        if(!["teacher", "admin"].includes(role)) throw new Error("Have not permissions!");
        const {lesson_id} = options;
        if(!lesson_id) throw new Error("Wrong params!");
        const lesson = await M_Lesson.findById(lesson_id);
        if(!lesson) throw new Error("Lesson does not exist!");
        await this._remove_lesson_from_lessons_plan(lesson_id);
        await lesson.remove();
    }

    async _remove_lesson_from_lessons_plan(lesson_id){
        const lessons_plan = await M_LessonsPlan.findOne();
        lesson_id = lesson_id.toString();
        for(const field of LESSONS_PLAN_FIELDS){
            for(let i = 0; i < lessons_plan[field].length; i++){
                if(lessons_plan[field][i]._id.toString() === lesson_id){
                    lessons_plan[field].splice(i, 1);
                    i--;
                }
            }
        }
        await lessons_plan.save();
    }

    _update_lesson_in_lessons_plan(options={}){
        let {lessons_plan, lesson_id, title} = options;
        lesson_id = lesson_id.toString();

        for(const field of LESSONS_PLAN_FIELDS){
            lessons_plan[field].forEach(i => {
                if(i._id.toString() === lesson_id)  i.title = title;
            });
        }
    }

    async get_lesson(options={}, role){
        const {login, lesson_id} = options;
        if(!lesson_id) throw new Error("Wrong params!");
        if(role === "student"){
            if(!login) throw new Error("Wrong params!");
            const student = await M_User.findById(login);
            await this._check_current_course_lesson(student, lesson_id);
        }

        return M_Lesson.findById(lesson_id, {_id: 1, chapter: 1, title: 1, text: 1, test:1, lab: 1});
    }

    async create_lessons_plan(role){
        if(role !== "admin") throw new Error("Have not permissions!");
        const is_exist = await M_LessonsPlan.findOne(); 
        if(is_exist) throw new Error("Lessons plan already exists!");
        await (new M_LessonsPlan()).save();
    }

    // UPDATE LESSONS PLAN ===
    /* 
        - Check that old struct is same as new one
        - Check that old plan's lessons is same that new ones
        - Update
    */
    async update_lessons_plan(options={}, role){
        if(!["teacher", "admin"].includes(role)) throw new Error("Have not permissions!");
        const lessons_plan = await M_LessonsPlan.findOne();
        if(!lessons_plan) throw new Error("Lessons plan does not exist!");
        this._validate_new_plan(options, lessons_plan);
        await this._save_new_plan(options, lessons_plan);
    }

    async _save_new_plan(new_plan, plan_doc){
        for(const field of LESSONS_PLAN_FIELDS){
            plan_doc[field] = new_plan[field];
        }
        await plan_doc.save();
    }

    _validate_new_plan(new_plan, old_lessons_plan){
        const new_plan_lessons = this._get_new_plan_lessons(new_plan);
        for(const field of LESSONS_PLAN_FIELDS){
            const lessons_arr = old_lessons_plan[field];
            for(const old_plan_lesson of lessons_arr){
                const new_plan_lesson = new_plan_lessons[old_plan_lesson._id];
                if(!new_plan_lesson) throw new Error("New plan has not all lessons from old plan!");
                if(new_plan_lesson.title !== old_plan_lesson.title) throw new Error("New plan has changed lessons!");
            }
        }
    }

    _get_new_plan_lessons(new_plan){
        const lessons = {};
        for(const field of LESSONS_PLAN_FIELDS){
            const arr = new_plan[field];
            if(!arr) throw new Error("Wrong new lessons plan struct!");
            arr.forEach(lesson => {
                lessons[lesson._id] = lesson;
            });
        }
        return lessons;
    }

    // UPDATE LESSONS PLAN === END

    // FINISH AND CHECK LESSON
    
    async finish_lesson(options={}, role){
        if(role !== "student") throw new Error("Action is not available!");
        const {login, lesson_id} = options;
        if(!login || !lesson_id) throw new Error("Wrong params!");
        const lesson = await M_Lesson.findById(lesson_id);
        if(!lesson) throw new Error("Lesson does not exist!");
        const student = await M_User.findById(login);
        if(!student) throw new Error("Student does not exist!");
        this._check_completed(student, lesson_id);
        await this._check_current_course_lesson(student, lesson_id);


        let is_lesson_finished = true;
        let mistakes = {};
        if(lesson.test){
            const test_mistakes = this._check_for_mistakes(options.test, lesson.test);
            if(test_mistakes.length) mistakes.test = test_mistakes;
        }
        if(lesson.lab){
            const lab_mistakes = this._check_for_mistakes(options.lab, lesson.lab.auto_check);
            if(lab_mistakes.length) mistakes.lab = lab_mistakes;
        }

        if(!Object.keys(mistakes).length) mistakes = null;
        else is_lesson_finished = false;

        if(is_lesson_finished){
            student.watched_lessons.push(lesson_id.toString());
            student.markModified("watched_lessons");
            await student.save();
        }

        return {is_lesson_finished, mistakes}
    }

    // lesson already completed
    async _check_completed(student, lesson_id){
        if(!student || !lesson_id) throw new Error("Wrong params!");
        const is_completed = student.watched_lessons.find(l => l === lesson_id.toString());
        if(is_completed) throw new Error("Lesson already complete!");
    }

    async _check_current_course_lesson(student, lesson_id){
        if(!student || !lesson_id) throw new Error("Wrong params!");
        const lessons_plan = await M_LessonsPlan.findOne({});
        if(!lessons_plan) throw new Error("Lessons plan does not exist!");
        const all_lessons = lessons_plan[`course_${student.course}`];
        const is_cur_course_lesson = all_lessons.find(l => l._id.toString() === lesson_id.toString());
        if(!is_cur_course_lesson) throw new Error("Student can't do non-current course lesson!");
    }

    _check_for_mistakes(student_answers, test){
        if(!test) throw new Error("Wrong params!");
        if(!student_answers || student_answers.length !== test.length) throw new Error("Wrong answers!");
        const mistakes = [];
        for(let i = 0; i < student_answers.length; i++){
            const correct_answer = test[i].correct_answer;
            if(student_answers[i] !== correct_answer){
                mistakes.push(i);
            } 
        }
        return mistakes;
    }

    // FINISH AND CHECK LESSON === END


    async get_student_info(options={}){
        const {login} = options;
        if(!login) throw new Error("Wrong params!");
        const student = await M_User.findById(login);
        if(!student) throw new Error("Student does not exist!");
        const {full_name, course, watched_lessons} = student;
        const lessons_plan = await M_LessonsPlan.findOne({});
        if(!lessons_plan) throw new Error("Lessons plan does not exist!");
        const all_lessons = lessons_plan[`course_${student.course}`];
        return {full_name, course, watched_lessons, all_lessons};
    }


    async get_lessons_plan(role){
        if(!["teacher", "admin"].includes(role)) throw new Error("Have not permissions!");
        return M_LessonsPlan.findOne();
    }


}

export default Lesson;