import Vue from 'vue';
import VueRouter from 'vue-router';
import SignIn from "@/views/SignIn/SignIn.vue";
import AppMain from "@/views/AppMain/AppMain.vue";
import AdminUsers from "@/views/Admin/AdminUsers.vue";
import LessonEditor from "@/views/Teacher/LessonEditor.vue";
import LessonsPlan from "@/views/Teacher/LessonsPlan.vue";
import StudentLessons from "@/views/Student/StudentLessons.vue";
import Lesson from "@/views/Student/Lesson.vue";
import StudentsProgress from "@/views/Teacher/StudentsProgress.vue";
import Chat from "@/views/Chat/Chat.vue";
import DialogsList from "@/views/Teacher/DialogsList.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Sign In',
    component: SignIn
  },
  {
    path: "/app",
    name: "AppMain",
    component: AppMain,
    children: [
      {
        name: "AdminUsers",
        path: "admin-users",
        component: AdminUsers
      },
      {
        name: "LessonEditor",
        path: "lesson-editor",
        component: LessonEditor,
        props: true
      },
      {
        name: "LessonsPlan",
        path: "lessons-plan",
        component: LessonsPlan
      },
      {
        name: "StudentsProgress",
        path: "students-progress",
        component: StudentsProgress
      },
      {
        name: "StudentLessons",
        path: "student-lessons",
        component: StudentLessons
      },
      {
        name: "Lesson",
        path: "lesson",
        component: Lesson,
        props: true
      },
      {
        name: "Chat",
        path: "chat",
        component: Chat,
        props: true
      },
      {
        name: "DialogsList",
        path: "dialogs-list",
        component: DialogsList
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
