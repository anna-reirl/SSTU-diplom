<template>
<div class="students_progress">
    <div class="card">    
        <div class="table-responsive">
            <table class="table mb-0 table-striped table-sm">
                <thead>
                <tr>
                    <th>Имя</th>
                    <th>Фамилия</th>
                    <th>Отчество</th>
                    <th>Класс</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="student in students" :key="student._id">
                    <td>{{student.full_name.surname}}</td>
                    <td>{{student.full_name.name}}</td>
                    <td>{{student.full_name.patronymic || "—"}}</td>
                    <td>{{student.course}}</td>
                    <td>
                        <span 
                            @click="show_student_progress(student._id)" 
                            class="btn btn-sm btn-warning" 
                            v-html="learn_progress_btn_text"
                        >
                        </span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    <progress-modal 
        v-if="is_progress_modal" 
        @close_modal="is_progress_modal = false" 
        :student_id="student_id"
    />
</div>
</template>

<script>
import ProgressModal from "@/components/ProgressModal/ProgressModal.vue";
export default {
    data(){
        return {
            students: [],
            is_progress_modal: false,
            student_id: null,
            learn_progress_btn_text: "Успеваемость"
        }
    },
    components: {
        "progress-modal": ProgressModal
    },
    methods: {
        async fetch_student_info(){
            this.students = await this.$api.students_list();
        },
        show_student_progress(student_id){
            Object.assign(this, {student_id, is_progress_modal: true});
        },
        depends_on_screen_size(){
          this.learn_progress_btn_text = screen.width <= 768 ? `<i class="fa-solid fa-graduation-cap"></i>` : "Успеваемость";
        },
    },
    async mounted(){
        await this.fetch_student_info();
        this.depends_on_screen_size();
        window.addEventListener("resize", this.depends_on_screen_size);
    },

    beforeDestroy(){
      window.removeEventListener("resize", this.depends_on_screen_size);
    }
}
</script>

<style scoped>
.students_progress{
    width: 100%;
    padding: 1%;
}

th, td{
    text-align: center;
}


@media (max-width: 600px) {
    th, td{
        font-size: 11px;
        vertical-align: middle;
    }
}
</style>