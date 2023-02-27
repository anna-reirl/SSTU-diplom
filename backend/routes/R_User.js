import User from "../domain/User.js";
import {http_safe_wrap} from "../lib/wrapper.js";
import Security from "../lib/Security.js";

class R_User extends User{
    constructor(){
        super();

        // wrapped
        this.r_create = http_safe_wrap(this.r_create.bind(this));
        this.r_get_users_list = http_safe_wrap(this.r_get_users_list.bind(this));
        this.r_get_students_list = http_safe_wrap(this.r_get_students_list.bind(this));
        this.r_signin = http_safe_wrap(this.r_signin.bind(this));
    }

    async r_create(req, res){
        const {role} = Security.jwtTokenCheck(req.cookies.token);
        const created_account = await this.create(req.body, role);
        res.json(created_account);
    }

    async r_get_users_list(req, res){
        const {role} = Security.jwtTokenCheck(req.cookies.token);
        const users_list = await this.get_users_list(req.query, role);
        res.json(users_list);
    }

    async r_get_students_list(req, res){
        const {role} = Security.jwtTokenCheck(req.cookies.token);
        const students_list = await this.get_students_list(role);
        res.json(students_list);
    }

    async r_signin(req, res){
        const {login, role, full_name} = await this.signin(req.body);
        res.cookie("token", Security.generate_token({login, role, full_name}), { maxAge: 86400000, httpOnly: true });
        res.json({role, full_name});
    }

    async r_who_am_i(req, res){
        let login = "Guest";
        let role = null;
        let full_name = null;
        try{
            ({login, role, full_name} = Security.jwtTokenCheck(req.cookies.token));
        }
        catch(err){}
        return res.json({user_id: login, role, full_name});
    }

    async r_log_out(req, res){
        res.clearCookie("token");
        res.json(null);
    }
}

export default R_User;