const MODE = process.env.NODE_ENV;
const MS_SECOND = 1000;
const MS_MINUTE = 60 * MS_SECOND;
const MS_HOUR = 60 * MS_MINUTE;
const PHYSICS_COURSES = [7,8,9,10,11];
const PHYSICS_CHAPTERS = [
    "Механика",
    "Оптика",
    "Термодинамика",
    "Электродинамика"
];
const LESSONS_PLAN_FIELDS = ["unused", ...PHYSICS_COURSES.map(i => `course_${i}`)];

let environment_config;

function dev_config(){
    const PROTOCOL = "http";
    const HOST = "localhost";
    const PORT = 8080;
    const HOSTNAME = `${PROTOCOL}://${HOST}:${PORT}`;
    const API_HOSTNAME = `${HOSTNAME}/api`;
    const WS_PORT = 3000;
    const WS_HOSTNAME = `ws://${HOST}:${WS_PORT}`;
    return {PROTOCOL, HOST, PORT, HOSTNAME, API_HOSTNAME, WS_HOSTNAME};
}

function production_config(){
    const PROTOCOL = "https";
    const HOST = "<hostname>";
    const PORT = 443;
    const HOSTNAME = `${PROTOCOL}://${HOST}`;
    const API_HOSTNAME = `${HOSTNAME}/api`;
    const WS_PORT = 3000;
    const WS_HOSTNAME = `ws://${HOST}:${WS_PORT}`;
    return {PROTOCOL, HOST, PORT, HOSTNAME, API_HOSTNAME, WS_HOSTNAME};
}


switch(MODE){
    case "production": 
        environment_config = production_config();
        break;
    default: environment_config = dev_config();
}


module.exports = {
    ...environment_config,
    MODE,
    MS_SECOND,
    MS_HOUR,
    PHYSICS_COURSES,
    PHYSICS_CHAPTERS,
    LESSONS_PLAN_FIELDS
}