<template>
<div class="admin_users">
    <div class="users_list card">
        <div class="card-header">
            <select class="form-control" v-model="users_list_type" @change="fetch_users_list">
                <option value="student">Ученики</option>
                <option value="teacher">Учителя</option>
            </select>
        </div>
        <div v-if="users_list_type === 'student'" class="card-body">
            <div class="table-responsive">
            <table class="table mb-0 table-striped table-sm">
                <thead>
                <tr>
                    <th>Имя</th>
                    <th>Фамилия</th>
                    <th>Отчество</th>
                    <th>Класс</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="student in users_list" :key="student._id">
                    <td>{{student.full_name.surname}}</td>
                    <td>{{student.full_name.name}}</td>
                    <td>{{student.full_name.patronymic || "—"}}</td>
                    <td>{{student.course}}</td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>

        <div v-else class="card-body">
            <div class="table-responsive">
            <table class="table mb-0 table-striped table-sm">
                <thead>
                <tr>
                    <th>Имя</th>
                    <th>Фамилия</th>
                    <th>Отчество</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="teacher in users_list" :key="teacher._id">
                    <td>{{teacher.full_name.surname}}</td>
                    <td>{{teacher.full_name.name}}</td>
                    <td>{{teacher.full_name.patronymic || "—"}}</td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
    </div>
    <div class="new_user card">
        <div class="card-header">
            <select class="form-control" v-model="new_user_type">
                <option value="student">Новый ученик</option>
                <option value="teacher">Новый учитель</option>
            </select>
        </div>
        <div v-if="new_user_type === 'student'" class="new_student card-body">
            <p class="text-sm">Заполните данные нового ученика.</p>
            <form class="form-horizontal">
                <div class="row gy-2 mb-4">
                    <label class="col-sm-3 form-label">Логин*</label>
                    <div class="col-sm-9">
                        <input v-model="new_student.login" class="form-control" type="text">
                    </div>
                </div>
                <div class="row gy-2 mb-4">
                    <label class="col-sm-3 form-label">Фамилия*</label>
                    <div class="col-sm-9">
                        <input v-model="new_student.surname" class="form-control" type="text">
                    </div>
                </div>
                <div class="row gy-2 mb-4">
                    <label class="col-sm-3 form-label">Имя*</label>
                    <div class="col-sm-9">
                        <input v-model="new_student.name" class="form-control" type="text">
                    </div>
                </div>
                <div class="row gy-2 mb-4">
                    <label class="col-sm-3 form-label">Отчество</label>
                    <div class="col-sm-9">
                        <input v-model="new_student.patronymic" class="form-control" type="text">
                    </div>
                </div>
                <div class="row gy-2 mb-4">
                    <label class="col-sm-3 form-label">Класс*</label>
                    <div class="col-sm-9">
                        <input v-model.number="new_student.course" class="form-control" type="number">
                    </div>
                </div>
                <div class="row gy-2 mb-4">
                    <label class="col-sm-3 form-label">Пароль*</label>
                    <div class="col-sm-9">
                        <input v-model="new_student.password" class="form-control" type="password">
                    </div>
                </div>
                <div class="row gy-2 mb-4">
                    <label class="col-sm-3 form-label">Повторите пароль*</label>
                    <div class="col-sm-9">
                        <input v-model="new_student.confirm_password" class="form-control" type="password">
                    </div>
                </div>
                <div class="row gy-2 mb-4">
                    <label class="col-sm-3 form-label">Электронная почта*</label>
                    <div class="col-sm-9">
                        <input v-model="new_student.email" class="form-control" type="email">
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-9 ms-auto">
                        <input @click.prevent="create_student" class="btn btn-primary" type="submit" value="Создать">
                    </div>
                </div>
            </form>
        </div>
        <div v-if="new_user_type === 'teacher'" class="new_teacher card-body">
            <p class="text-sm">Заполните данные нового учителя.</p>
            <form class="form-horizontal">
                <div class="row gy-2 mb-4">
                    <label class="col-sm-3 form-label">Логин*</label>
                    <div class="col-sm-9">
                        <input v-model="new_teacher.login" class="form-control" type="text">
                    </div>
                </div>
                <div class="row gy-2 mb-4">
                    <label class="col-sm-3 form-label">Фамилия*</label>
                    <div class="col-sm-9">
                        <input v-model="new_teacher.surname" class="form-control" type="text">
                    </div>
                </div>
                <div class="row gy-2 mb-4">
                    <label class="col-sm-3 form-label">Имя*</label>
                    <div class="col-sm-9">
                        <input v-model="new_teacher.name" class="form-control" type="text">
                    </div>
                </div>
                <div class="row gy-2 mb-4">
                    <label class="col-sm-3 form-label">Отчество</label>
                    <div class="col-sm-9">
                        <input v-model="new_teacher.patronymic" class="form-control" type="text">
                    </div>
                </div>
                <div class="row gy-2 mb-4">
                    <label class="col-sm-3 form-label">Пароль*</label>
                    <div class="col-sm-9">
                        <input v-model="new_teacher.password" class="form-control" type="password">
                    </div>
                </div>
                <div class="row gy-2 mb-4">
                    <label class="col-sm-3 form-label">Повторите пароль*</label>
                    <div class="col-sm-9">
                        <input v-model="new_teacher.confirm_password" class="form-control" type="password">
                    </div>
                </div>
                <div class="row gy-2 mb-4">
                    <label class="col-sm-3 form-label">Электронная почта*</label>
                    <div class="col-sm-9">
                        <input v-model="new_teacher.email" class="form-control" type="email">
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-9 ms-auto">
                        <input @click.prevent="create_teacher" class="btn btn-primary" type="submit" value="Создать">
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
</template>

<script>
import AlertError from "@/assets/lib/AlertError.js";
import Swal from "sweetalert2";
import {PHYSICS_COURSES} from "@/assets/config/constants.js";
export default {
    data: function(){
        return {
            new_user_type: "student",
            users_list_type: "student",
            new_student: {
                login: null,
                surname: null,
                name: null,
                patronymic: null,
                course: null,
                password: null,
                confirm_password: null,
                email: null
            },
            new_teacher: {
                login: null,
                name: null,
                surname: null,
                patronymic: null,
                password: null,
                confirm_password: null,
                email: null
            },
            users_list: []
        }
    },
    methods: {
        async create_student(){
            const {login, surname, name, patronymic, course, password, confirm_password, email} = this.new_student;
            if(!login || !surname || !name || !course || !password || !confirm_password || !email)
                throw new AlertError("Пожалуйста заполните все обязательные поля!");
            if(login.length < 6 || login.length > 50) throw new AlertError("Логин должен иметь длину в диапазоне 6-50 символов!");
            if(password.length < 6 || password.length > 100) throw new AlertError("Пароль должен иметь длину в диапазоне 6-100 символов!");
            if(!email.includes("@") || email.split("@").length !== 2) throw new AlertError("Неправильный формат электронной почты!");
            if(!PHYSICS_COURSES.includes(course)) throw new AlertError("Неправильный номер класса!");
            if(password !== confirm_password) throw new AlertError("Пароли не совпадаюТ!");
            const {_id} = await this.$api.create_user({login, surname, name, patronymic, course, password, email, role: "student"});
            if(this.users_list_type === "student") this.users_list.push({_id, full_name: {surname, name, patronymic}, course});
            Object.assign(this.new_student, {login: null, name: null, surname: null, course: null, patronymic: null, password: null, confirm_password: null, email: null});
            Swal.fire({text: "Аккаунт ученика создан успешно!", icon: "success"});
        },
        async create_teacher(){
            const {login, surname, name, patronymic, password, confirm_password, email} = this.new_teacher;
            if(!login || !surname || !name || !password || !confirm_password || !email)
                throw new AlertError("Пожалуйста заполните все обязательные поля!");
            if(login.length < 6 || login.length > 50) throw new AlertError("Логин должен иметь длину в диапазоне 6-50 символов!");
            if(password.length < 6 || password.length > 100) throw new AlertError("Пароль должен иметь длину в диапазоне 6-100 символов!");
            if(!email.includes("@") || email.split("@").length !== 2) throw new AlertError("Неправильный формат электронной почты!");
            if(password !== confirm_password) throw new AlertError("Пароли не совпадаюТ!");
            const {_id} = await this.$api.create_user({login, surname, name, patronymic, password, email, role: "teacher"});
            if(this.users_list_type === "teacher") this.users_list.push({_id, full_name: {surname, name, patronymic} });
            Object.assign(this.new_teacher, {login: null, name: null, surname: null, patronymic: null, password: null, confirm_password: null, email: null});
            Swal.fire({text: "Аккаунт учителя создан успешно!", icon: "success"});
        },
        async fetch_users_list(){
            this.users_list = await this.$api.users_list({role_to_show: this.users_list_type});
        }
    },
    async mounted(){
        await this.fetch_users_list();
    }
}
</script>

<style scoped>
.admin_users{
    width: 100%;
    display: flex;
    justify-content: space-around;
    padding-top: 2%;
}

.users_list{
    padding-bottom: 1%;
    width: 35%;
}

.new_user{
    width: 60%;
}

td, th{
    text-align: center;
}

@media (max-width: 992px) {
    .admin_users{
        flex-direction: column;
        align-items: center;
    }

    .users_list{
        width: 96%;
        margin-bottom: 3%;
    }

    .new_user{
       width: 96%;
    }

    td, th{
        font-size: 10px;
    }

}

@media (min-width: 600px) {
    td, th{
        font-size: 12px;
    }
}

@media (min-width: 768px) {
    td, th{
        font-size: 13px;
    }
}

@media (min-width: 992px) {
    td, th{
        font-size: 12px;
    }
}
</style>