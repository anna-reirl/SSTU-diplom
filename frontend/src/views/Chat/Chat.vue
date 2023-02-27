<template>
<div class="chat">
    <div class="chat_header">
        <h3>Чат</h3>
    </div>
    <div class="messages_area">
        <div class="message_row" 
            v-for="message in messages"  
            :key="message.date"
            :class="{own: message.sender.login === login}"
        >
            <div class="message">
                <div class="message_header">
                    <span class="sender">{{message.sender.name}} {{message.sender.surname}}</span>
                    <span class="date">{{format_date(message.date)}}</span>
                </div>
                <div class="message_text">{{message.text}}</div>
            </div>
        </div>
    </div>
    <div class="send_msg_area">
        <input v-model="new_message" type="text" class="form-control" placeholder="Введите ваше сообщение!">
        <span class="btn btn-primary" @click="send_message" v-html="send_msg_btn_text">
        </span>
        <span 
            v-if="role === 'teacher'" 
            v-html="clear_dialog_btn_text" 
            @click="clear_dialog" 
            class="btn btn-primary"
        >
        </span>
    </div>
</div>
</template>

<script>
import {io} from "socket.io-client";
import {WS_HOSTNAME} from "@/assets/config/constants.js";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import AlertError from "@/assets/lib/AlertError.js";
export default {
    props: {
        dialog_id: {type: String, required: true}
    },
    data(){
        return {
            new_message: null,
            messages: [],
            send_msg_btn_text: "Отправить",
            clear_dialog_btn_text: "Очистить"
        }
    },
    socket: null,
    computed: {
        role(){
            return this.$store.state.user.role;
        },
        login(){
            return this.$store.state.user.login;
        }
    },
    watch: {
        role(new_role){
            if(new_role === "teacher") this.$options.socket.emit("teacher_connected", {dialog_id: this.dialog_id});
        }
    },
    methods: {
        init_connection(){
            this.$options.socket = io(WS_HOSTNAME, {transports: ["websocket"]});
        },
        send_message(){
            const {socket} = this.$options;
            if(!this.new_message) return;
            const send_data = {text: this.new_message};
            if(this.role === "teacher") send_data.dialog_id = this.dialog_id;
            socket.emit("send_message", send_data);
            this.new_message = null;
        },
        fetch_messages(){
            const {socket} = this.$options;
            socket.emit("messages", {dialog_id: this.dialog_id});
        },
        format_date(date_str){
            return dayjs(date_str).format("HH:mm, DD.MM.YYYY");
        },
        async clear_dialog(){
            const {isConfirmed} = await Swal.fire({title: "Подтвердите действие", text: "Вы уверены что хотите удалить сообщения диалога?", showCancelButton: true, cancelButtonText: "Отмена"});
            if(!isConfirmed) return;
            this.$options.socket.emit("clear_dialog", {dialog_id: this.dialog_id});
        },
        scroll_to_bottom(container_selector){
            const container = document.querySelector(container_selector);
            if(!container) throw Error("Wrong container selector!");
            setTimeout(()=>{
                container.scrollTop = container.scrollHeight;
            }, 0);
        },
        new_message_listener(message){
            this.messages.push(message);
            this.scroll_to_bottom(".messages_area");
        },
        messages_listener(messages){
            this.messages = messages;
            this.scroll_to_bottom(".messages_area");
        },
        clear_dialog_listener(){
            this.messages.splice(0);
        },
        err_chat_listener(err_message){
            throw new AlertError(err_message);
        },
        depends_on_screen_size(){
          this.send_msg_btn_text = screen.width <= 768 ? `<i class="fa-solid fa-paper-plane"></i>` : "Отправить";
          this.clear_dialog_btn_text = screen.width <= 768 ? `<i class="fa-solid fa-trash-can"></i>` : "Очистить";
        },
    },
    async mounted(){
        this.init_connection();
        this.$options.socket.on("$new_message", this.new_message_listener);
        this.$options.socket.on("$messages", this.messages_listener);
        this.$options.socket.on("$clear_dialog", this.clear_dialog_listener);
        this.$options.socket.on("$err_chat", this.err_chat_listener);
        this.depends_on_screen_size();
        window.addEventListener("resize", this.depends_on_screen_size);
        await this.fetch_messages();
    },
    beforeDestroy(){
        this.$options.socket.off("$new_message", this.new_message_listener);
        this.$options.socket.off("$messages", this.messages_listener);
        this.$options.socket.off("$clear_dialog", this.clear_dialog_listener);
        this.$options.socket.off("$err_chat", this.err_chat_listener);
        this.$options.socket.disconnect();
        this.$options.socket = null;
        window.removeEventListener("resize", this.depends_on_screen_size);
    }
}
</script>

<style lang="scss" scoped>
.chat{
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 1%;
}

.chat_header{
    background-color: rgba(121, 106, 238, 0.9);
    display: flex;
    align-items: center;
    color: white;
}

.chat_header h3{
    width: 100%;
    text-align: center;
    margin: 0;
    padding: 0.5%;
}

.messages_area{
    flex: 1;
    background-color: white;
    padding: 1%;
    overflow-y: auto;
    max-height: 75vh;
}

.message_row{
    width: 100%;
    margin-top: 0.5%;
    display: flex;

    &:first-child{
        margin-top: 0;
    }

    &.own{
        justify-content: flex-end;
    }
}

.message{
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(121, 106, 238, 0.9);
    width: 60%;
}

.message_header{
    background-color: rgba(121, 106, 238, 0.9);
    display: flex;
    justify-content: space-between;
    padding: 0 1%;
    color: white;
}


.send_msg_area{
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1%;
}

.message_text{
    padding: 0 1%;
}

.btn{
    margin-left: 0.5%;
}

@media (max-width: 600px) {
    .message{
        width: 80%;
        margin-top: 2%;
    }

    .message_header{
        font-size: 12px;
    }
}

@media (min-width: 1400px) {
    .messages_area{
        max-height: 85vh;
    }
}

</style>