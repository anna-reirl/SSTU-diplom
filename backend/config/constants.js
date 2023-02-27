import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MODE = process.env.NODE_ENV || "development";
const PHYSICS_COURSES = [7,8,9,10,11];
const PHYSICS_CHAPTERS = [
    "Механика",
    "Оптика",
    "Термодинамика",
    "Электродинамика"
];
const LESSONS_PLAN_FIELDS = ["unused", ...PHYSICS_COURSES.map(i => `course_${i}`)];

const STATIC_FOLDER_NAME = "static";
const STATIC_FOLDER_PATH = path.resolve(__dirname, "..", STATIC_FOLDER_NAME);


let environment_config;

function dev_config(){
    const PROTOCOL = "http";
    const HOST = "localhost";
    const PORT = 3000;
    const HOSTNAME = `${PROTOCOL}://${HOST}:${PORT}`;
    return {PROTOCOL, HOST, PORT, HOSTNAME};
}


function production_config(){
    const PROTOCOL = "http";
    const HOST = "localhost";
    const PORT = 3000;
    const HOSTNAME = `${PROTOCOL}://${HOST}:${PORT}`;
    const FRONTEND_FOLDER = path.resolve(__dirname, "../../frontend/dist");
    const FRONTEND_ENTRY_PATH = path.resolve(FRONTEND_FOLDER, "index.html");
    return {PROTOCOL, HOST, PORT, HOSTNAME, FRONTEND_FOLDER, FRONTEND_ENTRY_PATH};
}

switch(MODE){
    case "production": 
        environment_config = production_config();
        break;
    default: environment_config = dev_config();
}

export default {
    ...environment_config,
    MODE,
    PHYSICS_COURSES,
    PHYSICS_CHAPTERS,
    LESSONS_PLAN_FIELDS,
    STATIC_FOLDER_NAME,
    STATIC_FOLDER_PATH,
    __dirname
}