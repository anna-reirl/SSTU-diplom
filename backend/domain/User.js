import M_User from "../models/user.js";
import AlertError from "../lib/AlertError.js";
import SHA1 from "crypto-js/sha1.js";
const {default: {PHYSICS_COURSES}} = await import("../config/constants.js");

class User{
    async create(options={}, creator_role){
        if(creator_role !== "admin") throw new Error("Have not permissions!");
        const {role, password, login} = options;
        if(!login || !password || !role) throw new Error("Wrong params!");
        if(login.length < 6 || login.length > 50) throw new AlertError("Логин должен иметь длину в диапазоне 6-50 символов!");
        if(password.length < 6 || password.length > 100) throw new AlertError("Пароль должен иметь длину в диапазоне 6-100 символов!");
        const is_exist = await M_User.findById(login);
        if(is_exist) throw new AlertError("Извините, такой логин уже занят!");
        switch(role){
            case "admin": 
                return this._create_admin(options);
            case "teacher": 
                return this._create_teacher(options);
            case "student":
                return this._create_student(options);
            default: throw new Error("Wrong role!");
        }

    }

    async _create_admin(options={}){
        const {login, password} = options;
        return (new M_User({_id: login, password: SHA1(password).toString(), role: "admin"})).save(); 
    }

    async _create_teacher(options={}){
        const {login, password, name, surname, patronymic} = options;
        if(!name || !surname) throw new AlertError("Пожалуйста заполните все обязательные поля!");
        const full_name = {name, surname};
        if(patronymic) full_name.patronymic = patronymic;
        return (new M_User({
            _id: login, 
            password: SHA1(password).toString(), 
            role: "teacher",
            full_name
        })).save(); 
    }

    async _create_student(options={}){
        const {login, password, name, surname, patronymic, course} = options;
        if(!name || !surname) throw new AlertError("Пожалуйста заполните все обязательные поля!");
        if(!PHYSICS_COURSES.includes(course)) throw new Error("Wrong course!");
        const full_name = {name, surname};
        if(patronymic) full_name.patronymic = patronymic;

        return (new M_User({
            _id: login, 
            password: SHA1(password).toString(), 
            role: "student",
            full_name,
            course,
            watched_lessons: []
        })).save(); 
    }


    async signin(options={}){
        const {login, password} = options;
        if(!login || !password) throw new Error("Wrong params!");
        const user = await M_User.findById(login);
        if(!user) throw new AlertError("Такой пользователь не сушествует!");
        if(SHA1(password).toString() !== user.password) throw new AlertError("Неправильный пароль!");
        return {login, role: user.role, full_name: user.full_name};
    }

    async get_users_list(options={}, viewer_role){
        if(viewer_role !== "admin") throw new Error("Have not permissions!");
        const {role_to_show} = options;
        if(!role_to_show) throw new Error("Wrong params!");
        if(!["student", "teacher"].includes(role_to_show)) throw new Error("Wrong role for show!");
        const fields_to_use = {_id: 1, role: 1, email: 1, full_name: 1};
        if(role_to_show === 'student') fields_to_use.course = 1;
        return M_User.find({role: role_to_show}, fields_to_use);
    }

    async get_students_list(viewer_role){
        if(!["teacher", "admin"].includes(viewer_role)) throw new Error("Have not permissions!");
        return M_User.find({role: "student"}, {_id: 1, full_name: 1, course: 1, watched_lessons: 1});
    }
}

export default User;