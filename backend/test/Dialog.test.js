import Dialog from "../domain/Dialog";
import M_Dialog from "../models/dialog";
import {db_connect} from "../config/db_connection";
import M_User from "../models/user";
import User from "../domain/User";
import mongoose from "mongoose";

const user = new User();

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

beforeEach(async()=>{
    await user.create(STUDENT, "admin");
    await user.create(TEACHER, "admin");
});

afterEach(async() =>{
    await M_User.deleteMany({});
    await M_Dialog.deleteMany({});
});


beforeAll(async() => {
    await db_connect("school_test");
});

afterAll(async() => {
   mongoose.connection.close();
});


describe("send_message()", () => {

    test("first message from student to teacher sent", async () => {
        const dialog = new Dialog();
        const text = "Hello, teacher!";
        await dialog.send_message({text}, {role: STUDENT.role, login: STUDENT.login});
        const found_dialog = await M_Dialog.findById(STUDENT.login);
        expect(found_dialog).toBeTruthy();
        expect(found_dialog._id).toBe(STUDENT.login);
        expect(found_dialog.messages?.length).toBe(1);
        expect(found_dialog.messages[0].text).toBe(text);
        expect(found_dialog.is_read_by_student).toBe(true);
        expect(found_dialog.is_answered_by_teacher).toBe(false);
        expect(found_dialog.last_message.text).toBe(text);
        expect(found_dialog.messages[0].sender.login).toBe(STUDENT.login);
        expect(found_dialog.last_message.sender.login).toBe(STUDENT.login);
    });

    test("response message from teacher to student sent", async () => {
        const dialog = new Dialog();
        const text = "Hello, student!";
        await dialog.send_message({text: "Hello, teacher!"}, {role: STUDENT.role, login: STUDENT.login});
        await dialog.send_message({dialog_id: STUDENT.login, text}, {role: TEACHER.role, login: TEACHER.login});
        const found_dialog = await M_Dialog.findById(STUDENT.login);
        expect(found_dialog.messages?.length).toBe(2);
        expect(found_dialog.messages[1].text).toBe(text);
        expect(found_dialog.is_read_by_student).toBe(false);
        expect(found_dialog.is_answered_by_teacher).toBe(true);
        expect(found_dialog.last_message.text).toBe(text);
        expect(found_dialog.messages[1].sender.login).toBe(TEACHER.login);
        expect(found_dialog.last_message.sender.login).toBe(TEACHER.login);
    });

    test("response message from student to teacher sent", async() => {
        const dialog = new Dialog();
        const text = "I have a question!";
        await dialog.send_message({text: "Hello, teacher!"}, {role: STUDENT.role, login: STUDENT.login});
        await dialog.send_message({dialog_id: STUDENT.login, text: "Hello, student!"}, {role: TEACHER.role, login: TEACHER.login});
        await dialog.send_message({text}, {role: STUDENT.role, login: STUDENT.login});
        const found_dialog = await M_Dialog.findById(STUDENT.login);
        expect(found_dialog.messages?.length).toBe(3);
        expect(found_dialog.messages[2].text).toBe(text);
        expect(found_dialog.is_read_by_student).toBe(true);
        expect(found_dialog.is_answered_by_teacher).toBe(false);
        expect(found_dialog.last_message.text).toBe(text);
        expect(found_dialog.messages[2].sender.login).toBe(STUDENT.login);
        expect(found_dialog.last_message.sender.login).toBe(STUDENT.login);
    });
});

describe("get_messages()", () => {

    test("messages received by teacher", async() => {
        const dialog = new Dialog();
        await dialog.send_message({text: "Hello, teacher!"}, {role: STUDENT.role, login: STUDENT.login});
        await dialog.send_message({dialog_id: STUDENT.login, text: "Hello, student!"}, {role: TEACHER.role, login: TEACHER.login});
        const messages = await dialog.get_messages({dialog_id: STUDENT.login}, {role: TEACHER.role, login: TEACHER.login});
        expect(messages.length).toBe(2);
    });

    test("messages received by student", async() => {
        const dialog = new Dialog();
        await dialog.send_message({text: "Hello, teacher!"}, {role: STUDENT.role, login: STUDENT.login});
        await dialog.send_message({dialog_id: STUDENT.login, text: "Hello, student!"}, {role: TEACHER.role, login: TEACHER.login});
        const messages = await dialog.get_messages({dialog_id: STUDENT.login}, {role: STUDENT.role, login: STUDENT.login});
        expect(messages.length).toBe(2);
        const test_dialog = await M_Dialog.findById(STUDENT.login);
        expect(test_dialog.is_read_by_student).toBe(true);
    });
});

describe("get_dialogs_list()", () => {
    test("dialogs list received", async() => {
        await user.create({...STUDENT, login: STUDENT.login + "1"}, "admin");
        await user.create({...STUDENT, login: STUDENT.login + "2"}, "admin");

        const dialog = new Dialog();
        // first
        await dialog.send_message({text: "Hello, teacher!"}, {role: STUDENT.role, login: STUDENT.login});
        await dialog.send_message({dialog_id: STUDENT.login, text: "Hello, student!"}, {role: TEACHER.role, login: TEACHER.login});
        
        // second
        await dialog.send_message({text: "Hello, teacher!"}, {role: STUDENT.role, login: STUDENT.login + "1"});
        
        // third
        await dialog.send_message({text: "Hello, teacher!"}, {role: STUDENT.role, login: STUDENT.login + "2"});
        
        const dialogs_list = await dialog.get_dialogs_list(TEACHER.role);
        expect(dialogs_list.length).toBe(3);
        expect(dialogs_list[0].is_answered_by_teacher).toBe(false);
        expect(dialogs_list.slice(-1)[0].is_answered_by_teacher).toBe(true);
    });
});

describe("clear_dialog()", () => {
    test("dialog cleared", async () => {
        const dialog = new Dialog();

        await dialog.send_message({text: "Hello, teacher!"}, {role: STUDENT.role, login: STUDENT.login});
        await dialog.send_message({dialog_id: STUDENT.login, text: "Hello, student!"}, {role: TEACHER.role, login: TEACHER.login});
        
        await dialog.clear_dialog({dialog_id: STUDENT.login}, TEACHER.role);
        const cleared_dialog = await M_Dialog.findById(STUDENT.login);
        expect(cleared_dialog.messages.length).toBe(0);

    });
});

describe("get_non_answered_dialogs_count()", () => {
    test("correct count of dialogs received", async () => {
        await user.create({...STUDENT, login: STUDENT.login + "1"}, "admin");
        await user.create({...STUDENT, login: STUDENT.login + "2"}, "admin");

        const dialog = new Dialog();
        await dialog.send_message({text: "Hello, teacher!"}, {role: STUDENT.role, login: STUDENT.login + "1"});
        await dialog.send_message({text: "Hello, teacher!"}, {role: STUDENT.role, login: STUDENT.login + "2"});

        const data = await dialog.get_non_answered_gialogs_count(TEACHER.role);
        expect(data).toHaveProperty("count", 2);
    })
});

describe("has_new_messages()", ()=>{
    test("have not new messages", async() => {
        const dialog = new Dialog();
        const data = await dialog.has_new_messages({login: STUDENT.login, role: STUDENT.role});
        expect(data).toHaveProperty("has_messages", false);
    });

    test("has new messages", async() => {
        const dialog = new Dialog();
        await dialog.send_message({text: "Hello, teacher!"}, {role: STUDENT.role, login: STUDENT.login});
        await dialog.send_message({dialog_id: STUDENT.login, text: "Hello, student!"}, {role: TEACHER.role, login: TEACHER.login});
        const data = await dialog.has_new_messages({login: STUDENT.login, role: STUDENT.role});
        expect(data).toHaveProperty("has_messages", true);
    });
});