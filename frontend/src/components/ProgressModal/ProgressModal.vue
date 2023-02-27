<template>
  <div class="progress_modal_wrapper">
      <div class="progress_modal" v-if="student">
        <h4 class="pm_header">
            <span></span>
            <span class="full_name">
                {{full_name}}
            </span>
            <span @click="close_modal" class="close_modal_btn"><i class="fa-solid fa-xmark"></i></span>
        </h4>
        <div class="pm_content"> 
            <div class="brief_info">
                <h5 class="course">{{student.course}} класс</h5>
                <h5>Прогресс: {{student.watched_lessons.length}}/{{student.all_lessons.length}}</h5>
            </div>
            <hr>
            <div class="lessons">
                <template v-for="lesson in student.all_lessons">
                    <p v-if="lesson.completed" class="lesson" :class="{completed: lesson.completed}" :key="lesson._id">
                        <i class="fas fa-check"> </i> {{lesson.title}}
                    </p>
                    <p v-else class="lesson" :key="lesson._id">
                        {{lesson.title}}
                    </p>
                </template>
            </div>
        </div>
        <div class="btns">

        </div>
      </div>
  </div>
</template>

<script>
export default {
    props: {
        student_id: {type: String, required: true}
    },
    computed:{
        full_name(){
            if(!this.student?.full_name) return "";
            const {name, surname, patronymic} = this.student.full_name;
            let full_name = `${surname} ${name}`;
            if(patronymic) full_name += ` ${patronymic}`;
            return full_name;
        }
    },
    data: function(){
        return {
            student: null
        }
    },

    methods:{
        async fetch_student_info(){
            const student = await this.$api.student_info({login: this.student_id});
            const watched_lessons = new Set(student.watched_lessons);
            for(const lesson of student.all_lessons){
                if(watched_lessons.has(lesson._id)) lesson.completed = true;
            }
            this.student = student;
        },
        //CLOSE ================================================================================
        close_modal(){
            this.$emit("close_modal");
        }
    },
    async mounted(){
        await this.fetch_student_info();
    }
}
</script>

<style lang="scss" scoped>
.progress_modal_wrapper{
    background-color: #808080a8;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;

    .progress_modal{
      display: flex;
      flex-direction: column;
      width: 50%;
      min-height: 400px;
      background-color: white;
      margin-top: 5%;
    }

    .pm_header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2%;
        height: 40px;
        font-size: 25px;
        background-color: rgba(121, 106, 238, 0.9);
        color: white;
        font-weight: bold;
        .fa-times{ cursor: pointer; }
    }


    .pm_content{
        display: flex;
        height: 90%;
        width: 90%;
        flex: 1;
        margin: auto;
        flex-direction: column;

        *{
            font-size: 20px;
        }
    }

    .brief_info{
        display: flex;
        justify-content: space-between;
        align-items: center;

        h5{
            margin: 0;
        }
    }

    .lessons{
        overflow-y: auto;
        max-height: 300px;
    }

    .lesson{
        background-color: rgba(121, 106, 238, 0.9);
        padding: 1%;
        color: white;
    }

    .btns{
        display: flex;
        justify-content: space-evenly;
        padding: 1% 0;
    }

    hr{
        margin: 10px 0;
    }

    .close_modal_btn{
        cursor: pointer;
    }

    p.completed{
        background-color: #1b7a4b;
    }


     @media (max-width: 992px) {
        .progress_modal{
            width: 96%;
        }

        .full_name{
            font-size: 13px;
        }

        .brief_info h5{
            font-size: 15px;
        }

        .lesson{
            padding: 1% 5%;
            font-size: 14px;
        }

        p{
            margin-bottom: 2%;
        }
    }

    @media (min-width: 600px) {
        .full_name{
            font-size: 15px;
        }
    }

    @media (min-width: 768px) {
        .progress_modal{
            width: 80%;
        }
    }

    @media (min-width: 992px) {
        .progress_modal{
            width: 50%;
        }

        .full_name{
            font-size: 18px;
        }
    }

}
</style>