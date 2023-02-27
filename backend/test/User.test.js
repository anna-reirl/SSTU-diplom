import User from "../domain/User.js";
import {db_connect} from "../config/db_connection";
import mongoose from "mongoose";
import M_User from "../models/user";

const ADMIN = {
    login: "test_admin",
    password: "test_admin",
    role: "admin"
}

const TEACHER = {
    login: "test_teacher",
    password: "test_teacher",
    role: "teacher",
    name: "Учитель",
    surname: "Учителев",
    patronymic: "Учителевич"
}

const STUDENT = {
    login: "test_student",
    password: "test_student",
    role: "student",
    name: "Иван",
    surname: "Иванов",
    patronymic: "Иванович",
    course: 7
}

beforeAll(async() => await db_connect("school_test"));
afterAll(async() => {
    mongoose.connection.close();
});
afterEach( async() => await M_User.deleteMany({}) );


describe("create()", () => {

    test("admin account created", async () => {
        const user = new User();
        const {role, login, password} = ADMIN;
        const admin_account = await user.create({role, login, password}, ADMIN.role);
        expect(admin_account).toMatchObject({_id: login, role});
    });

    test("teacher account created", async () => {
        const user = new User();
        const {name, surname, patronymic, login, role, password} = TEACHER;
        const teacher_account = await user.create({
            login, role, password, name, surname, patronymic
        }, ADMIN.role);
        expect(teacher_account).toMatchObject({
            _id: login, role,
            full_name: { name, surname, patronymic }
        });
    });

    test("student account created", async () => {
        const user = new User();
        const {name, surname, patronymic, login, role, password, course} = STUDENT;
        const student_account = await user.create({
            login, role, password, name, surname, patronymic, course  
        }, ADMIN.role);
        expect(student_account).toMatchObject({
            _id: login, role, watched_lessons: [], course,
            full_name: { name, surname, patronymic }
        });
    });
});


describe("signin()", () => {

    test("user authorized in the system", async() => {
        const user = new User();
        const {name, surname, patronymic, login, role, password} = TEACHER;
        await user.create({
            login, role, password, name, surname, patronymic
        }, ADMIN.role);
        const after_auth_data = await user.signin({login, password});
        expect(after_auth_data).toMatchObject({login, role});
    });
});

describe("get_users_list()", () => {
    let user;

    beforeAll(async()=>{
        user = new User();
        {
            const {login, password, role, name, surname, patronymic, course} = STUDENT;
            await user.create({login, password, role, name, surname, patronymic, course}, ADMIN.role);
        }
        {
            const {login, password, role, name, surname, patronymic} = TEACHER;
            await user.create({login, password, role, name, surname, patronymic}, ADMIN.role);
        }
    });

    
    test("students list received", async () => {
        const users = await user.get_users_list({role_to_show: "student"}, ADMIN.role);
        expect(users.every(i => i.role === 'student')).toBe(true);
    });

    test("teachers list received", async () => {
        const users = await user.get_users_list({role_to_show: "teacher"}, ADMIN.role);
        expect(users.every(i => i.role === 'teacher')).toBe(true);
    });
});

describe("get_students_list()", () => {
    let user;
    let non_student_login;

    beforeAll(async()=>{
        user = new User();
        {
            const {login, password, role, name, surname, patronymic, course} = STUDENT;
            await user.create({login, password, role, name, surname, patronymic, course}, ADMIN.role);
        }
        {
            const {login, password, role, name, surname, patronymic} = TEACHER;
            await user.create({login, password, role, name, surname, patronymic}, ADMIN.role);
            non_student_login = TEACHER.login;
        }
    });

    test("only students list received", async() => {
        const students = await user.get_students_list(TEACHER.role);
        const has_non_student_login = students.find(i => i._id === non_student_login);
        expect(has_non_student_login).toBeUndefined();
    });
});