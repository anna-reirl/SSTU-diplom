import Security from "../lib/Security.js";
import parse_cookie from "../lib/parse_cookie.js";
import Dialog from "../domain/Dialog.js";
const dialog = new Dialog();

export default function(socket){
    try{
        const {token} = parse_cookie(socket.handshake.headers.cookie);
        if(!token){ 
            socket.disconnect();
            throw new Error("Non authenticated connection!");
        }
        const {login, role} = Security.jwtTokenCheck(token);
        if(role === "student"){
            socket.join(login);
        }

        socket.on("teacher_connected", (options={}) => {
            try{
                const {dialog_id} = options;
                if(!dialog_id) throw new Error("Wrong dialog id!");
                socket.join(dialog_id);
            }
            catch(err){
               console.log(err);
               socket.emit("$err_chat", "Что-то пошло не так!");
            }
        });

        socket.on("messages", async(options={}) => {
            try{
                const messages = await dialog.get_messages(options, {login, role});
                socket.emit("$messages", messages);
            }
            catch(err){
                console.log(err);
                socket.emit("$err_chat", "Что-то пошло не так!");
            }
        });

        socket.on("clear_dialog", async(options={})=>{
            try{
                const {dialog_id} = options;
                if(!dialog_id) throw new Error("Wrong params!");
                await dialog.clear_dialog(options, role);
                socket.to(dialog_id).emit("$clear_dialog");
                socket.emit("$clear_dialog");
            }
            catch(err){
                console.log(err);
                socket.emit("$err_chat", "Что-то пошло не так!");
            }
        });

        socket.on("send_message", async(options={}) => {
            try{
                const {text} = options;
                if(!text) throw new Error("Wrong params!");
                let dialog_id;
                if(role === "student"){
                    dialog_id = login;
                }
                else{
                    if(!options.dialog_id) throw new Error("Wrong params!");
                    dialog_id = options.dialog_id;
                }
                const updated_dialog = await dialog.send_message({dialog_id, text}, {login, role});
                socket.to(dialog_id).emit("$new_message", updated_dialog.last_message);
                socket.emit("$new_message", updated_dialog.last_message);
            }
            catch(err){
                console.log(err);
                socket.emit("$err_chat", "Что-то пошло не так!");
            }
        });
    }

    
    catch(err){
       socket.emit("$err_chat", "Что-то пошло не так!");
       console.log(err);
    }
}