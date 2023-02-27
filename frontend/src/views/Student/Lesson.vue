<template>
<div class="lesson" v-if="lesson">
    <div class="card">
        <div class="card-body">
            <h3 class="lesson_header">{{lesson.title}}</h3>
            <h4 class="lesson_chapter">
                <i class="fa-solid fa-flask"></i> {{lesson.chapter}}
            </h4>
            <hr>
            <div v-html="lesson.text"></div>
            <template v-if="lesson.test && lesson.test.length > 0">
                <hr>    
                <div class="test_area">
                    <h3>Тест</h3>
                    <div 
                        v-for="(test_item, index) in lesson.test" :key="index" 
                        class="test_item" 
                        :class="{wrong: test_item.is_wrong}"
                    >
                        <p><b>{{index + 1}}. {{test_item.question}}</b> </p>
                        <p v-for="answer, answer_index in test_item.answers" :key="answer">
                            <input type="radio" :name="'test' + test_item.question"
                                @click="answer_question('test', answer, index)"
                            >
                            {{test_item.answers[answer_index]}}
                        </p>
                    </div>
                </div>
            </template>
            <template v-if="lesson.lab && lesson.lab.auto_check.length > 0">
                <hr>    
                <div class="lab_area">
                    <h3>Лабораторная работа</h3>
                    <lab-view :cur_lab="lesson.lab.id" class="lab_view" />
                    <div 
                        v-for="(lab_item, index) in lesson.lab.auto_check" :key="index" 
                        class="lab_item"
                        :class="{wrong: lab_item.is_wrong}"
                    >
                        <p><b>{{index + 1}}. {{lab_item.question}}</b> </p>
                        <template v-if="lab_item.question_type === 'quiz'">
                            <p v-for="answer, answer_index in lab_item.answers" :key="answer">
                                <input type="radio" :name="'lab' + lab_item.question"
                                    @click="answer_question('lab', answer, index)"
                                >
                                {{lab_item.answers[answer_index]}}
                            </p>
                        </template>
                        <template v-else>
                            <div class="input-group mb-3"><span class="input-group-text">Ответ</span>
                                <input v-model="lab_text_answer" class="form-control" type="text"
                                    @blur="answer_question('lab', lab_text_answer, index)"
                                >
                            </div>
                        </template>
                    </div>
                </div>
            </template>
            <hr>
            <div class="btns_controls">
                <div class="btn btn-primary" @click="finish_lesson">Завершить урок</div>
            </div>
        </div>
    </div>

</div>
</template>

<script>
import AlertErorr from "@/assets/lib/AlertError.js";
import Swal from 'sweetalert2';
export default {
    props: {
        lesson_id: {type: String, required: true}
    },
    data(){
        return {
            test_answers: [],
            lab_answers: [],
            lab_text_answer: null, 
            test_letters: ["A", "B", "C", "D"],
            lesson: null
        }
    },
    components: {
        "lab-view": () => import("@/components/Simulation/LabView.vue")
    },
    methods: {
        answer_question(control_type, answer, index){
            this[`${control_type}_answers`][index] = answer;
        },
        async fetch_lesson(){
            const lesson = await this.$api.lesson({lesson_id: this.lesson_id});
            this.reset_wrong_answers(lesson);
            this.lesson = lesson;
        },
        show_wrong_answers({test, lab}){
            this.reset_wrong_answers(this.lesson);
            const mark_as_wrong = (wrong_index_list, items_list) => {
                items_list.forEach((item, index) => { 
                    if(wrong_index_list.includes(index))
                        item.is_wrong = true;
                });
            }
            if(test) mark_as_wrong(test, this.lesson.test);
            if(lab) mark_as_wrong(lab, this.lesson.lab.auto_check);
        },
        reset_wrong_answers(lesson){
            if(lesson.test?.length > 0){
                lesson.test.forEach(test_item => test_item.is_wrong = false);
            }
            if(lesson.lab?.auto_check?.length > 0){
                lesson.lab.auto_check.forEach(lab_item => lab_item.is_wrong = false);
            }
        },
        async finish_lesson(){
            const finished_lesson = {lesson_id: this.lesson_id};
            if(this.lesson.test?.length > 0){
                if(this.test_answers.length !== this.lesson.test.length)
                    throw new AlertErorr("Ответьте на все вопросы теста!");
                finished_lesson.test = this.test_answers;
            }
            if(this.lesson.lab?.auto_check?.length > 0){
                if(this.lab_answers.length !== this.lesson.lab.auto_check.length)
                    throw new AlertErorr("Ответьте на все вопросы лабораторной работы!");
                finished_lesson.lab = this.lab_answers;
            }
            const finish_info = await this.$api.finish_lesson(finished_lesson);
            if(!finish_info.is_lesson_finished){
                this.show_wrong_answers(finish_info.mistakes);
                throw new AlertErorr("Вы ответили неправильно на некоторые вопросы! Исправьте ошибки и попробуйте снова!");
            }
            else{
                await Swal.fire({title: "Поздравляем!", text: "Урок успешно пройден! Вы молодец! :)", icon: "success"});
                this.$router.push({name: "StudentLessons"});
            }
        }
    },
    async mounted(){
        await this.fetch_lesson();
    }
}
</script>

<style lang="scss" scoped>
.lesson{
    width: 100%;
    padding: 1%;
}

.lesson_header{
    font-size: 30px;
}
.lesson_chapter{
    margin-top: 1.5%;
}

.test_area, .lab_area{

    h3{
        font-size: 30px;
        text-align: center;
    }
}

.lab_view{
    margin-bottom: 5%;
}

.test_item, .lab_item{
    padding: 1%;
    margin-top: 1%;
}

.wrong{
    background-color: #fba9a9;
}

.btns_controls{
    display: flex;
    justify-content: center;
}


@media (max-width: 600px) {
    .lesson_header{
        font-size: 18px;
    }

    .lesson_chapter{
        font-size: 14px;
    }
}
</style>