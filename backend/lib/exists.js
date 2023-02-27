import fs from "fs/promises";

async function is_entity_exists(path){
    try{
        await fs.stat(path);
        return true;
    }
    catch(err){
       return false;
    }
}

const is_folder_exists = is_entity_exists;
const is_file_exists = is_entity_exists;

export {
    is_folder_exists,
    is_file_exists
}