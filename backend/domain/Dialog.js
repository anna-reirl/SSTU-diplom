import M_Dialog from "../models/dialog.js";
import M_User from "../models/user.js";

class Dialog{

    // SEND MESSAGE =====

    async send_message(options={}, {role, login}){
        if(!["student", "teacher"].includes(role)) throw new Error("Action is not available!");
        const user = await M_User.findById(login);
        if(!user) throw new Error("User does not exist!");
        const {name, surname} = user.full_name;
        options["sender"] = {login, name, surname};
        if(role === "student"){ 
            options["dialog_id"] = login;
            return this._send_to_teachers(options);
        }
        return await this._send_to_student(options);
    }

    // teachers to student
    async _send_to_student(options={}){
        return this._send({...options, is_answered_by_teacher: true, is_read_by_student: false});
    }

    // student to teachers
    async _send_to_teachers(options={}){
        return this._send({...options, is_answered_by_teacher: false, is_read_by_student: true});
    }

    async _send(options={}){
        const {dialog_id, text, sender, is_answered_by_teacher, is_read_by_student} = options;
        if(!dialog_id || !text || !sender) throw new Error("Wrong params!"); 
        let dialog;
        dialog = await M_Dialog.findById(dialog_id);
        const now = new Date();
        const message = {text, date: now, sender};
        if(!dialog) {
            dialog = new M_Dialog({
                _id: dialog_id, 
                messages: [ message ],
                last_message: message,
                is_answered_by_teacher,
                is_read_by_student
            });
        }
        else{
            dialog.messages.push(message);
            dialog.last_message = message;
            dialog.is_answered_by_teacher = is_answered_by_teacher;
            dialog.is_read_by_student = is_read_by_student;
        }
        return dialog.save();
    }

    // SEND MESSAGE ===== END

    async get_messages(options={}, {login, role}){
        const {dialog_id} = options;
        if(!dialog_id) throw new Error("Wrong params!");
        if(role === "student" && dialog_id !== login)
            throw new Error("Have not access to non-owned chat!")
        const dialog = await M_Dialog.findById(dialog_id);
        if(!dialog) throw new Error("Dialog does not exist!");
        if(role === "student" && !dialog.is_read_by_student){
            dialog.is_read_by_student = true;
            await dialog.save();
        }
        return dialog.messages;
    }

    async get_dialogs_list(role){
        if(!["teacher", "admin"].includes(role)) throw new Error("Have not permissions!");
        const fields_to_use = {_id: 1, last_message: 1, is_answered_by_teacher: 1};
        return M_Dialog.find({}, fields_to_use).sort({is_answered_by_teacher: 1, "last_message.date": -1});
    }

    async clear_dialog(options={}, role){
        if(!["teacher", "admin"].includes(role)) throw new Error("Have not permissions!");
        const {dialog_id} = options;
        if(!dialog_id) throw new Error("Wrong params!");
        const dialog = await M_Dialog.findById(dialog_id);
        if(!dialog) throw new Error("Dialog does not exist!");
        dialog.messages.splice(0);
        await dialog.save();
    }

    // teacher will get count of non-answered dialogs
    async get_non_answered_gialogs_count(role){
        if(!["teacher", "admin"].includes(role)) throw new Error("Have not permissions!");
        const count = await M_Dialog.find({is_answered_by_teacher: false}).countDocuments();
        return {count};
    }

    // student's check
    async has_new_messages({login, role}){
        if(role !== "student") throw new Error("Action is not available!");
        if(!login) throw new Error("Wrong params!");
        const dialog = await M_Dialog.findById(login);
        if(!dialog) return {has_messages: false};
        const has_messages = !dialog.is_read_by_student;
        return {has_messages};
    }

}

export default Dialog;