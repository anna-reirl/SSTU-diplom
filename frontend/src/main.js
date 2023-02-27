import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import {build_api} from "@/assets/lib/build_api";

Vue.config.productionTip = false;
Vue.prototype.$api = build_api([
  ["log_out", "GET"],
  ["signin", "POST"],
  ["create_user", "POST"],
  ["users_list", "GET"],
  ["who_am_i", "GET"],
  ["students_list", "GET"],

  ["create_lesson", "POST"],
  ["lessons_plan", "GET"],
  ["update_lessons_plan", "POST"],
  ["lesson", "GET"],
  ["update_lesson", "POST"],
  ["remove_lesson", "POST"],
  ["student_info", "GET"],
  ["finish_lesson", "POST"],

  ["delete_lesson_img", "POST"],

  ["non_answered_dialogs_count", "GET"],
  ["has_new_messages", "GET"],
  ["dialogs_list", "GET"]
], router); 

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
