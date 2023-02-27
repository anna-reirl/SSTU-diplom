<template>
<nav class="side-navbar z-index-40">
    <span class="text-uppercase text-xs letter-spacing-0 py-4  mx-3 px-2 heading">Меню</span>
    <template v-for="(paths, show_role) in routes">
    <ul v-if="user_role === show_role" :key="show_role" class="list-unstyled">
        <li 
            v-for="menu_path, index in paths" 
            :key="menu_path + index" 
            class="sidebar-item"
            :class="{active: menu_path.name === $route.name}"
            @click.prevent="go_to(menu_path.name)"
        >
            <a class="sidebar-link" href="#"> 
            <span><i :class="menu_path.icon"></i> {{menu_path.text}} </span></a>
        </li>
    </ul>
    </template>
</nav>
</template>

<script>
const routes = {
    admin: [
        {name: "AdminUsers", text: "Пользователи", icon: "fa-solid fa-users"}
    ],
    teacher: [
        {name: "LessonsPlan", text: "Учебный План", icon: "fa-solid fa-clipboard-list"},
        {name: "LessonEditor", text: "Редактор Урока", icon: "fa-solid fa-pen-to-square"},
        {name: "StudentsProgress", text: "Ученики", icon: "fa-solid fa-users"},
        {name: "DialogsList", text: "Вопросы", icon: "fa-solid fa-question"}
    ],
    student: [
        {name: "StudentLessons", text: "Уроки", icon: "fa-solid fa-graduation-cap"},
        {name: "Chat", text: "Задать вопрос", icon: "fa-solid fa-question"}
    ]
}
export default {
    data(){
        return {
            routes
        }
    },
    computed: {
        login(){
            return this.$store.state.user.login;
        },
        user_role(){
            return this.$store.state.user.role;
        }
    },
    methods:{ 
        go_to(name){
            if(!name) throw new Error("Wrong route name!");
            if(this.$route.name === name) return;
            const navigation_args = {name};
            if(name === "Chat") navigation_args["params"] = {dialog_id: this.login};
            this.$router.push(navigation_args);
        }
    }
}
</script>

<style>

.side-navbar .heading{
    color: black;
}
</style>