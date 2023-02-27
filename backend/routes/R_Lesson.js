import Lesson from "../domain/Lesson.js";
import {http_safe_wrap} from "../lib/wrapper.js";
import Security from "../lib/Security.js";

class R_Lesson extends Lesson{
    constructor(){
        super();

        // wrapped
        this.r_create = http_safe_wrap(this.r_create.bind(this));
        this.r_update = http_safe_wrap(this.r_update.bind(this));
        this.r_remove = http_safe_wrap(this.r_remove.bind(this));
        this.r_get_lesson = http_safe_wrap(this.r_get_lesson.bind(this));
        this.r_update_lessons_plan = http_safe_wrap(this.r_update_lessons_plan.bind(this));
        this.r_finish_lesson = http_safe_wrap(this.r_finish_lesson.bind(this));
        this.r_get_student_info = http_safe_wrap(this.r_get_student_info.bind(this));
        this.r_get_lessons_plan = http_safe_wrap(this.r_get_lessons_plan.bind(this));
    }

    async r_create(req, res){
        const {role} = Security.jwtTokenCheck(req.cookies.token);
        const created_lesson = await this.create(req.body, role);
        res.json(created_lesson);
    }

    async r_update(req, res){
        const {role} = Security.jwtTokenCheck(req.cookies.token);
        await this.update(req.body, role);
        res.json(null);
    }

    async r_remove(req, res){
        const {role} = Security.jwtTokenCheck(req.cookies.token);
        await this.remove(req.body, role);
        res.json(null);
    }

    async r_get_lesson(req, res){
        const {login, role} = Security.jwtTokenCheck(req.cookies.token);
        const lesson = await this.get_lesson({...req.query, login}, role);
        res.json(lesson);
    }

    async r_update_lessons_plan(req, res){
        const {role} = Security.jwtTokenCheck(req.cookies.token);
        await this.update_lessons_plan(req.body, role);
        res.json(null);
    }

    async r_finish_lesson(req, res){
        const {login, role} = Security.jwtTokenCheck(req.cookies.token);
        const finish_info = await this.finish_lesson({...req.body, login}, role);
        res.json(finish_info);
    }

    async r_get_student_info(req, res){
        let login, role;
        ({login, role} = Security.jwtTokenCheck(req.cookies.token));
        if(["admin", "teacher"].includes(role)) login = req.query.login;
        const student_info = await this.get_student_info({login});
        res.json(student_info);
    }

    async r_get_lessons_plan(req, res){
        const {role} = Security.jwtTokenCheck(req.cookies.token);
        const lessons_plan = await this.get_lessons_plan(role);
        res.json(lessons_plan);
    }
}

export default R_Lesson;