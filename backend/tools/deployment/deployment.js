import {db_connect} from "../../config/db_connection.js";
import M_User from "../../models/user.js";
import User from "../../domain/User.js";
import Lesson from "../../domain/Lesson.js";

const user = new User();
const lesson = new Lesson();

async function create_admin(){
    const ADMIN_LOGIN = "school_admin";
    const ADMIN_PASSWORD = "school_admin";
    const is_admin_exists = await M_User.findById(ADMIN_LOGIN);
    if(is_admin_exists){
        console.log(`Admin '${ADMIN_LOGIN}' already exists!`);
        return;
    }
    await user.create({login: ADMIN_LOGIN, password: ADMIN_PASSWORD, role: "admin"}, "admin");
    console.log("Admin account created!");
}

async function create_lessons_plan(){
    try{
        await lesson.create_lessons_plan("admin");
        console.log("Lessons plan created!");
    }
    catch(err){
       if(err.message === "Lessons plan already exists!"){
          console.log(err.message);  
       }
       else console.log(err);
    }
}

await db_connect("school");
await create_admin();
await create_lessons_plan();
process.exit();