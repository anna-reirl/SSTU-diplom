<template>
<div class="lesson_editor">
    <div class="lesson_description">
        <label><b>Тема урока</b></label>
        <input v-model="title" type="text" class="form-control">
        <select v-model="chapter" class="form-control chapter_selection">
            <option  value="">Выберите раздел физики</option>
            <option v-for="chapter of chapters" :key="chapter" :value="chapter">{{chapter}}</option>
        </select>
    </div>
    <div class="lesson_text">
        <vue-editor 
            v-model="lesson_text" 
            class="text_editor"
            useCustomImageHandler
            @image-added="on_editor_image_added"
            @image-removed="on_editor_image_removed"
        />
    </div>
    <div class="test_editor">
        <h2 class="section_header text-center">Тест</h2>
        <div v-for="(test_item, index) in test" :key="index" class="test_item">
            <p><b>{{index + 1}}</b>. {{test_item.question}} </p>
            <p 
                v-for="answer, answer_index in test_item.answers" :key="answer_index"
                :class="{correct: test_item.answers[answer_index] === test_item.correct_answer}"
            >
                {{test_letters[answer_index]}}. {{test_item.answers[answer_index]}}
            </p>
            <div class="delete_test_item_btn btn btn-danger btn-sm" @click="delete_list_item('test', index)">
                <i class="fa-solid fa-trash"></i>
                Удалить Вопрос
            </div>
        </div>
        <div class="new_test_item">
            <h3>Hовый вопрос</h3>
            <div class="input-group mb-3"><span class="input-group-text">Вопрос</span>
                <input class="form-control" type="text" v-model="new_test_item.question">
            </div>
            <div class="input-group mb-3"><span class="input-group-text">A</span>
                <input v-model="new_test_item.answers.a" class="form-control" type="text">
            </div>
            <div class="input-group mb-3"><span class="input-group-text">B</span>
                <input v-model="new_test_item.answers.b" class="form-control" type="text">
            </div>
            <div class="input-group mb-3"><span class="input-group-text">C</span>
                <input v-model="new_test_item.answers.c" class="form-control" type="text">
            </div>
            <div class="input-group mb-3"><span class="input-group-text">D</span>
                <input v-model="new_test_item.answers.d" class="form-control" type="text">
            </div>
            <select class="form-control" v-model="new_test_item.correct_answer">
                <option value="">Выберите правильный ответ</option>
                <option 
                    v-for="correct_option of test_quiz_options" 
                    :key="correct_option" 
                    :value="correct_option"
                > {{correct_option}}
                </option>
            </select>
            <div class="add_test_item_btn btn btn-primary" @click="add_test_item">Добавить вопрос</div>
        </div>
    </div>
    <div class="lab_editor">
      <h2 class="section_header text-center">Лабораторная работа</h2>
    </div>
    <simulation @switch_lab="on_switch_lab" />
    
    <h3>Выбранная симуляция</h3>
    <input v-model="lab_name" class="selected_simulation form-control" type="text" readonly>
    
    <div v-for="(lab_item, index) in lab" :key="index" class="lab_item">
        <p><b>{{index + 1}}</b>. {{lab_item.question}} </p>
        <template v-if="lab_item.question_type === 'quiz'">
            <p 
                v-for="answer, answer_index in lab_item.answers" :key="answer_index"
                :class="{correct: lab_item.answers[answer_index] === lab_item.correct_answer}"
            >
                {{test_letters[answer_index]}}. {{lab_item.answers[answer_index]}}
            </p>
        </template>
        <template v-else>
            <p class="correct">{{lab_item.correct_answer}}</p>
        </template>
        <div class="delete_lab_item_btn btn btn-danger btn-sm" @click="delete_list_item('lab', index)">
            <i class="fa-solid fa-trash"></i>
            Удалить Вопрос
        </div>
    </div>
    <div class="new_lab_item">
        <h3>Hовый вопрос</h3>
        <div class="input-group mb-3"><span class="input-group-text">Вопрос</span>
            <input class="form-control" type="text" v-model="new_lab_item.question">
        </div>
        <select class="answer_type form-control" v-model="new_lab_item.question_type">
            <option value="">Выберите тип ответа</option>
            <option value="quiz">Тест</option>
            <option value="text_answer">Текстовый ответ</option>
        </select>
        <template v-if="new_lab_item.question_type === 'quiz'">
            <div class="input-group mb-3"><span class="input-group-text">A</span>
                <input v-model="new_lab_item.answers.a" class="form-control" type="text">
            </div>
            <div class="input-group mb-3"><span class="input-group-text">B</span>
                <input v-model="new_lab_item.answers.b" class="form-control" type="text">
            </div>
            <div class="input-group mb-3"><span class="input-group-text">C</span>
                <input v-model="new_lab_item.answers.c" class="form-control" type="text">
            </div>
            <div class="input-group mb-3"><span class="input-group-text">D</span>
                <input v-model="new_lab_item.answers.d" class="form-control" type="text">
            </div>
            <select class="form-control" v-model="new_lab_item.quiz_correct_answer">
                <option value="">Выберите правильный ответ</option>
                <option 
                    v-for="correct_option of lab_quiz_options" 
                    :key="correct_option" 
                    :value="correct_option"
                > {{correct_option}}
                </option>
            </select>
        </template>
        <template v-else>
            <div class="input-group mb-3"><span class="input-group-text">Ответ</span>
                <input class="form-control" type="text" v-model="new_lab_item.input_correct_answer">
            </div>
        </template>
        <div class="add_test_item_btn btn btn-primary" @click="add_lab_item">Добавить вопрос</div>
    </div>
    <div class="lesson_controls">
        <div class="btn btn-primary" @click="save_lesson">Сохранить</div>
    </div>
</div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import {PHYSICS_CHAPTERS, API_HOSTNAME} from "@/assets/config/constants";
import AlertError from "@/assets/lib/AlertError.js";
import Swal from "sweetalert2";
import Simulation from "@/components/Simulation/Simulation.vue";

function quiz_options(new_item){
    return function() {
        const options = [];
        const {a, b, c, d} = this[new_item].answers;
        [a, b, c, d].forEach(i => i && options.push(i));
        return options;
    }
}

export default {
    props: {
        lesson_id: {type: String, default: null}
    },
    components: {
        "vue-editor": VueEditor,
        "simulation": Simulation
    },
    data: function(){
        return {
            chapters: PHYSICS_CHAPTERS,
            title: null,
            chapter: "",
            lesson_text: "",
            test_letters: ["a", "b", "c", "d"],
            test: [],
            new_test_item: {
                question: null,
                answers: {
                    a: null,
                    b: null,
                    c: null,
                    d: null
                },
                correct_answer: ""
            },
            lab_id: null,
            lab_name: null,
            lab: [],
            new_lab_item: {
                question_type: "quiz", // quiz, text_answer
                question: null,
                answers: {
                    a: null,
                    b: null,
                    c: null,
                    d: null
                },
                quiz_correct_answer: "",
                input_correct_answer: ""
            }
        }
    },
    computed: {
        test_quiz_options: quiz_options("new_test_item"),
        lab_quiz_options: quiz_options("new_lab_item")
    },
    methods: {
        async on_editor_image_added(file, Editor, cursorLocation, resetUploader){
            const formData = new FormData();
            formData.append("lesson-img", file);
            const response = await fetch(`${API_HOSTNAME}/upload_lesson_img`, {method: "POST", body: formData});
            if(!response.ok) throw new AlertError("Ошибка при загрузке изображения!");
            const {url} = await response.json();
            Editor.insertEmbed(cursorLocation, "image", url);
            resetUploader();
        },
        async on_editor_image_removed(img_url){
            await this.$api.delete_lesson_img({img_url});
        },
        on_switch_lab({lab_id, lab_name}){
            Object.assign(this, {lab_id, lab_name: lab_id ? lab_name : null});
        },
        delete_list_item(list_name, index){
            this[list_name].splice(index, 1);
        },
        add_test_item(){
            const {question, answers, correct_answer} = this.new_test_item;
            if(!question) throw new AlertError("Пожалуйста введите тестовый вопрос!");
            const {a, b, c, d} = answers;
            if(!a || !b || !c || !d) throw new AlertError("Пожалуйста заполните все варианты ответа!");
            if(!correct_answer) throw new AlertError("Пожалуйста выберите правильный ответ!");
            this.test.push({question, correct_answer, answers: [a, b, c, d]});
            Object.assign(this.new_test_item, {question: null, correct_answer: null});
            Object.assign(this.new_test_item.answers, {a: null, b: null, c: null, d: null});
        },
        add_lab_item(){
            const {question_type, question, answers, input_correct_answer, quiz_correct_answer} = this.new_lab_item;
            if(!question) throw new AlertError("Пожалуйста введите вопрос!");
            if(!question_type) throw new AlertError("Пожалуйста выберите тип ответа!");
            const lab_item = {question, question_type, correct_answer: ""};
            if(question_type === "text_answer"){
                if(!input_correct_answer) throw new AlertError("Пожалуйста введите ответ на вопрос!");
                lab_item.correct_answer = input_correct_answer;
            }
            else{
                const {a, b, c, d} = answers;
                if(!a || !b || !c || !d) throw new AlertError("Пожалуйста заполните все варианты ответа!");
                if(!quiz_correct_answer) throw new AlertError("Пожалуйста выберите правильный ответ!");
                lab_item.correct_answer = quiz_correct_answer;
                Object.assign(lab_item, {correct_answer: quiz_correct_answer, answers: [a, b, c, d]});
            }
            this.lab.push(lab_item);
            Object.assign(this.new_lab_item, {question: null, quiz_correct_answer: "", input_correct_answer: ""});
            Object.assign(this.new_lab_item.answers, {a: null, b: null, c: null, d: null});
        },
        async save_lesson(){
            const {title, chapter, lesson_text} = this;
            if(!title) throw new AlertError("Пожалуйста заполните тему урока!");
            if(!chapter) throw new AlertError("Пожалуйста заполните раздел физики!");
            if(!lesson_text) throw new AlertError("Пожалуйста заполните содержимое урока!");
            const lesson = {title, chapter, text: lesson_text};
            if(this.test.length > 0){
                lesson.test = this.test;
            }
            if(this.lab.length > 0){
                const {lab_id, lab_name} = this;
                if(!lab_id) throw new AlertError("Пожалуйста выберите симуляцию для лабораторной работы!");
                lesson.lab = {id: lab_id, name: lab_name, auto_check: this.lab};
            }
            if(this.lesson_id){ 
                await this.$api.update_lesson({...lesson, lesson_id: this.lesson_id});
                Swal.fire({text: "Урок успешно обновлен!", icon: "success"});
            }
            else{ 
                await this.$api.create_lesson(lesson);
                Swal.fire({text: "Урок успешно создан!", icon: "success"});
            }
        },
        async fetch_lesson(){
            const lesson = await this.$api.lesson({lesson_id: this.lesson_id});
            Object.assign(this, {title: lesson.title, chapter: lesson.chapter, lesson_text: lesson.text});
            if(lesson.test) this.test = lesson.test;
            if(lesson.lab) {
                this.lab = lesson.lab.auto_check;
                this.lab_id = lesson.lab.id;
                this.lab_name = lesson.lab.name;
            }
        }
    },
    async mounted(){
        if(this.lesson_id) await this.fetch_lesson();
    }
}
</script>

<style scoped>
.lesson_editor{
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 1%;
}

.lesson_description{
    padding-top: 1%;
}

.chapter_selection{
    margin-top: 1%;
}

.text_editor{
    width: 100%;
}


.lesson_text{
    display: flex;
    justify-content: center;
    padding-top: 1%;
    height: 400px;
    margin-bottom: 6%;
}

.section_header{
    font-size: 25px;
    margin-bottom: 0;
}

.test_item{
    border-bottom: 1px solid rgba(121, 106, 238, 0.9);
}

.new_test_item, .new_lab_item{
    margin-top: 3%;
}

.add_test_item_btn{
    margin-top: 1%;
}

.delete_test_item_btn{
    margin: 0;
    margin-bottom: 1%;
}

.correct{
    color: green;
}

.lab_editor{
    margin-top: 3%;
}

.new_lab_item .answer_type{
    margin-bottom: 1%;
}

.lab_item{
    padding: 1% 0;
    border-bottom: 1px solid rgba(121, 106, 238, 0.9);
}

.lesson_controls{
    margin-top: 1%;
    display: flex;
    justify-content: center;
}

 @media (max-width: 600px) {
    .test_editor{
        margin-top: 45%;
    }
 }

@media (min-width: 420px) {
    .test_editor{
        margin-top: 25%;
    }
}

@media (min-width: 600px) {
    .test_editor{
        margin-top: 10%;
    }
}
</style>