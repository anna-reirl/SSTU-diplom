<template>
<header class="header z-index-50">
    <nav class="navbar py-1 px-0 shadow-sm text-white position-relative">
        <!-- Search Box-->
        <div class="search-box shadow-sm">
        <button class="dismiss d-flex align-items-center">
            <svg class="svg-icon svg-icon-heavy">
            <use xlink:href="#close-1"> </use>
            </svg>
        </button>
        <form id="searchForm" action="#" role="search">
            <input class="form-control shadow-0" type="text" placeholder="What are you looking for...">
        </form>
        </div>
        <div class="container-fluid w-100">
        <div class="navbar-holder d-flex align-items-center justify-content-between w-100">
            <!-- Navbar Header-->
            <div class="navbar-header">
            <!-- Navbar Brand -->
            <a class="navbar-brand d-none d-sm-inline-block" href="#">
                <div class="brand-text d-none d-lg-inline-block"><span>Vector </span></div>
                <div class="brand-text d-none d-sm-inline-block d-lg-none">Vector</div></a>
                <a class="menu-btn active" id="toggle-btn" href="#"><span></span><span></span><span></span></a>
            </div>
            <!-- Navbar Menu -->
            <ul class="nav-menu list-unstyled d-flex flex-md-row align-items-md-center">
                <li v-if="can_see_messages" class="nav-item" @click="on_notifies_click"> 
                    <a class="nav-link text-white" id="messages" rel="nofollow" href="#" aria-expanded="false">
                        <i class="fa-regular fa-envelope"></i>
                        <span v-if="role === 'teacher' && non_answered_dialogs_count > 0" class="badge bg-orange badge-corner fw-normal">{{non_answered_dialogs_count}}</span>
                        <span v-if="role === 'student' && has_new_messages" class="badge bg-red badge-corner fw-normal">!</span> 
                    </a>
                </li>
                <!-- Logout  -->
                <li class="nav-item">
                    <a @click.prevent="log_out" class="nav-link text-white" href="#"> 
                        <span>
                        <i class="fa-solid fa-right-from-bracket"></i> Выйти</span>
                    </a>
                </li>
            </ul>
        </div>
        </div>
    </nav>
</header>
</template>

<script>
import {MS_SECOND} from "@/assets/config/constants.js";
export default {
    data(){
        return {
            has_new_messages: false,
            non_answered_dialogs_count: 0
        }
    },
    computed: {
        role(){
            return this.$store.state.user.role;
        },
        login(){
            return this.$store.state.user.login;
        },
        can_see_messages(){
            if(this.role === "student" && this.$route.name !== "Chat") return true;
            if(this.role === "teacher" && this.$route.name !== "DialogsList") return true;
            return false;
        }
    },
    watch:{
        role(){
            this.fetch_notifies();
        }
    },
    notify_fetch_timer: null,
    methods: {
        async log_out(){
            await this.$api.log_out();
            this.$router.push({name: "Sign In"});
        },
        async fetch_notifies(){
            if(this.role === "student")
                this.has_new_messages = (await this.$api.has_new_messages()).has_messages;
            
            if(this.role === "teacher")
                this.non_answered_dialogs_count = (await this.$api.non_answered_dialogs_count()).count;
        },

        on_notifies_click(){
            if(this.role === "student")
                this.$router.push({name: "Chat", params: {dialog_id: this.login}});
            
            if(this.role === "teacher")
                this.$router.push({name: "DialogsList"});
        },
        fetch_notifies_on_timer(){
            this.$options.notify_fetch_timer = setInterval(this.fetch_notifies, 30 * MS_SECOND);
        }
    },
    async mounted(){
        if(this.role) await this.fetch_notifies();
        this.fetch_notifies_on_timer();
    },
    beforeDestroy(){
        const {notify_fetch_timer} = this.$options;
        if(notify_fetch_timer) clearInterval(notify_fetch_timer);
    }
}
</script>

<style>
.navbar{
    width: 100%;
}
</style>