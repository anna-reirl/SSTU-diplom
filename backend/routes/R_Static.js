import {http_safe_wrap} from "../lib/wrapper.js";
import Security from "../lib/Security.js";
import fs from "fs/promises";
import path from "path";
const {default: {
    STATIC_FOLDER_NAME,
    STATIC_FOLDER_PATH,
    __dirname
}} = await import("../config/constants.js");
import {is_file_exists} from "../lib/exists.js";

class R_Static{

    constructor(){

        // wrapped
        this.r_upload_lesson_img = http_safe_wrap(this.r_upload_lesson_img.bind(this));
        this.r_delete_lesson_img = http_safe_wrap(this.r_delete_lesson_img.bind(this));
    }

    async r_upload_lesson_img(req, res){
        const {role} = Security.jwtTokenCheck(req.cookies.token);
        if(!["teacher", "admin"].includes(role)) throw new Error("Have not permissions!");
        const lesson_img = req.files["lesson-img"];
        if(!lesson_img) throw new Error("Lesson image does not specified!");
        const unique_name = lesson_img.md5.slice(-10) + Date.now().toString(16).slice(-5);
        const relative_link = path.join("lesson_img", `${unique_name}${path.extname(lesson_img.name)}`)
        await lesson_img.mv(path.resolve(STATIC_FOLDER_PATH, relative_link));
        res.json({url: `${STATIC_FOLDER_NAME}/${relative_link}`});
    }

    async r_delete_lesson_img(req, res){
        const {role} = Security.jwtTokenCheck(req.cookies.token);
        if(!["teacher", "admin"].includes(role)) throw new Error("Have not permissions!");
        const img_url = req.body["img_url"];
        if(!img_url) throw new Error("Wrong params!");
        const file_path = path.resolve(__dirname, "..", img_url);
        if(await is_file_exists(file_path))
            await fs.unlink(file_path);
        res.json(null);
    }
}

export default R_Static;