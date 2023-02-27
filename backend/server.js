import express from "express";
import cookie_parser from "cookie-parser";
import file_upload from "express-fileupload";
import {db_connect} from "./config/db_connection.js";
import R_User from "./routes/R_User.js";
import R_Lesson from "./routes/R_Lesson.js";
import R_Static from "./routes/R_Static.js";
import R_Dialog from "./routes/R_Dialog.js";


import http from "http";
import {Server} from "socket.io";
import real_time_chat from "./routes/real_time_chat.js";



const {default: {
    HOST, PORT, 
    FRONTEND_FOLDER, FRONTEND_ENTRY_PATH, 
    STATIC_FOLDER_PATH,
    MODE
}} = await import("./config/constants.js");


const app = express();
const http_server = http.createServer(app);
const io = new Server(http_server);


io.on("connection", real_time_chat);
await db_connect("school");

app.use(file_upload());
app.use(cookie_parser());
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/static", express.static(STATIC_FOLDER_PATH));

if(MODE === 'production'){
    app.use(express.static(FRONTEND_FOLDER));

    app.get("/", (req, res) => {
        res.sendFile(FRONTEND_ENTRY_PATH);
    });
}

const r_user = new R_User();
const r_lesson = new R_Lesson();
const r_static = new R_Static();
const r_dialog = new R_Dialog();

const api_router = express.Router();
app.use("/api", api_router);


// users
api_router.get("/users_list", r_user.r_get_users_list);
api_router.get("/students_list", r_user.r_get_students_list);
api_router.get("/log_out", r_user.r_log_out);
api_router.post("/signin", r_user.r_signin);
api_router.post("/create_user", r_user.r_create);
api_router.get("/who_am_i", r_user.r_who_am_i);

// lessons
api_router.get("/lesson", r_lesson.r_get_lesson);
api_router.get("/student_info", r_lesson.r_get_student_info);
api_router.get("/lessons_plan", r_lesson.r_get_lessons_plan);
api_router.post("/create_lesson", r_lesson.r_create);
api_router.post("/update_lesson", r_lesson.r_update);
api_router.post("/remove_lesson", r_lesson.r_remove);
api_router.post("/update_lessons_plan", r_lesson.r_update_lessons_plan);
api_router.post("/finish_lesson", r_lesson.r_finish_lesson);

// static
api_router.post("/upload_lesson_img", r_static.r_upload_lesson_img);
api_router.post("/delete_lesson_img", r_static.r_delete_lesson_img);

// dialog
api_router.get("/dialogs_list", r_dialog.r_get_dialogs_list);
api_router.get("/non_answered_dialogs_count", r_dialog.r_get_non_answered_gialogs_count);
api_router.get("/has_new_messages", r_dialog.r_has_new_messages);

http_server.listen(PORT, HOST, ()=>{
    console.log(`HTTP server is working on ${HOST}:${PORT}!`);
});

