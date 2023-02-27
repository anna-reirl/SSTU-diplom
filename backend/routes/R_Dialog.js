import Dialog from "../domain/Dialog.js";
import {http_safe_wrap} from "../lib/wrapper.js";
import Security from "../lib/Security.js";

class R_Dialog extends Dialog{
    constructor(){
        super();

        // wrapped
        this.r_get_dialogs_list = http_safe_wrap(this.r_get_dialogs_list.bind(this));
        this.r_get_non_answered_gialogs_count = http_safe_wrap(this.r_get_non_answered_gialogs_count.bind(this));
        this.r_has_new_messages = http_safe_wrap(this.r_has_new_messages.bind(this));
    }


    async r_get_dialogs_list(req, res){
        const {role} = Security.jwtTokenCheck(req.cookies.token);
        const dialogs_list = await this.get_dialogs_list(role);
        res.json(dialogs_list);
    }

    async r_get_non_answered_gialogs_count(req, res){
        const {role} = Security.jwtTokenCheck(req.cookies.token);
        const dialogs_count = await this.get_non_answered_gialogs_count(role);
        res.json(dialogs_count);
    }

    async r_has_new_messages(req, res){
        const {login, role} = Security.jwtTokenCheck(req.cookies.token);
        const has_new_messages = await this.has_new_messages({login, role});
        res.json(has_new_messages);
    }
}

export default R_Dialog;