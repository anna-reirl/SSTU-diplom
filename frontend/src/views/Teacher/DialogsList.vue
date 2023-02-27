<template>
<div class="dialogs_list">
    <div v-for="dialog in dialogs" :key="dialog._id" @click="go_to_chat(dialog._id)" class="dialog card">
        <div class="dialog_header">
            <span>{{dialog.last_message.sender.name}} {{dialog.last_message.sender.surname}}</span>
            <span>{{format_date(dialog.last_message.date)}}</span>
        </div>
        <div class="dialog_last_message" :class="{unread: !dialog.is_answered_by_teacher}">
            <p>{{cut_text(dialog.last_message.text, 35)}}</p>
        </div>
    </div>
</div>
</template>

<script>
import dayjs from "dayjs";
import {cut_text} from "@/assets/lib/helpers.js";
export default {
    data(){
        return {
            dialogs: []
        }
    },
    methods: {
        cut_text,
        format_date(date_str){
            return dayjs(date_str).format("HH:mm, DD.MM.YYYY");
        },
        go_to_chat(dialog_id){
            this.$router.push({name: "Chat", params: {dialog_id}});
        }
    },
    async mounted(){
        this.dialogs = await this.$api.dialogs_list();
    }
}
</script>

<style>
.dialogs_list{
    width: 100%;
    padding: 1%;
}

.dialog{
    display: flex;
    flex-direction: column;
    margin-bottom: 1%;
    cursor: pointer;
}

.dialog_last_message p{
    margin: 0;
}

.dialog_header{
    display: flex;
    justify-content: space-between;
    background-color: rgba(121, 106, 238, 0.9);
    color: white;
    padding: 0 1%;
}

.dialog_last_message{
    padding: 0 1%;
}

.unread{
    background-color: rgba(121, 106, 238, 0.3);
}
</style>