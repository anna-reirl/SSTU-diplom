<template>
<div class="page">
    <app-header class="app_header" />
    <div class="page-content d-flex align-items-stretch"> 
        <main-menu />
        <router-view />
    </div>
</div>
</template>

<script>
import AppHeader from "@/components/AppHeader/AppHeader.vue";
import MainMenu from "@/components/MainMenu/MainMenu.vue";
import {activate_theme_scripts} from "@/assets/raw/js/front.js";
export default {
    components: {
        "app-header": AppHeader,
        "main-menu": MainMenu
    },
    async mounted(){
        activate_theme_scripts();
        const {user_id, full_name, role} = await this.$api.who_am_i();
        if(role === "admin" && this.$route.name !== "AdminUsers") this.$router.push({name: "AdminUsers"});
        if(role === "teacher" && this.$route.name !== "LessonsPlan") this.$router.push({name: "LessonsPlan"});
        if(role === "student" && this.$route.name !== "StudentLessons") this.$router.push({name: "StudentLessons"});
        this.$store.commit("set_user", {login: user_id, full_name, role});
    }
}
</script>

<style>
.page{
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.app_header{
    width: 100%;
    display: flex;
    flex: 0;
}

.page-content{
    display: flex;
    flex: 1;
}
</style>