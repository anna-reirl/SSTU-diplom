<template>
<div class="student_lessons">
<div v-if="course" class="lessons_container card">
    <div class="card-body">
         <h3>{{course}} класс</h3>
         <hr>
         <div class="lessons_list">
            <div class="lesson" :class="{completed: completed_lessons.has(lesson._id)}"  v-for="lesson of lessons" :key="lesson._id">             
              <div class="lesson_title">
                  <i class="fas fa-check" v-if="completed_lessons.has(lesson._id)"></i> {{lesson.title}}
              </div>  
              <div class="lesson_controls"> 
                <span 
                    v-if="!completed_lessons.has(lesson._id)" 
                    class="edit_lesson_btn btn btn-warning" 
                    @click="learn_lesson(lesson._id)"
                    v-html="learn_lesson_btn_text"
                  >
                </span>  
              </div>
            </div>
         </div>
    </div>
</div>
</div>
</template>

<script>
export default {
    data: function(){
        return {
            course: null,
            lessons: [],
            completed_lessons: null,
            learn_lesson_btn_text: "Изучить" 
        }
    },
    methods: {
        async fetch_student_info(){
            const student_info = await this.$api.student_info();
            this.course = student_info.course;
            this.lessons = student_info.all_lessons;
            this.completed_lessons = new Set(student_info.watched_lessons);
        },
        learn_lesson(lesson_id){
            this.$router.push({name: "Lesson", params: {lesson_id}});
        },
        depends_on_screen_size(){
          this.learn_lesson_btn_text = screen.width <= 768 ? `<i class="fa-solid fa-graduation-cap"></i>` : "Изучить";
        }
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

<style lang="scss" scoped>
.student_lessons{
  width: 100%;
  padding: 1%;
}

.lessons_container{
  width: 94%;
  padding: 0;
  margin: 0 auto;
  margin-top: 1%;
}

.lesson{
  padding: 1% 2%;
  color: white;
  background-color: rgba(121, 106, 238, 0.9);
  margin-top: 1%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:first-child{
    margin-top: 0;
  }
}

.lessons_list{
  min-height: 50px;
  display: flex;
  flex-direction: column;
}


.completed{
    background-color: #1b7a4b;
}

.lesson_controls{
  width: 10%;
  display: flex;
  justify-content: space-around;
}

.lesson_controls{
  margin-left: 2%;
}


 @media (max-width: 600px) {
  .lessons_container{
    display: flex;
    justify-content: center;
  }

  .card-body{
    padding: 0;
    width: 100%;
  }

  .lesson_controls{
    width: 15%;
    display: flex;
    justify-content: center;
  }

 }

@media (min-width: 768px) {
  .lesson{
    padding-right: 3%;
  }
}

@media (min-width: 992px) {
  .lesson{
    padding-right: 1%;
  }
}
</style>