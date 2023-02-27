<template>
  <div class="lessons_plan">
  <template v-if="lessons_plan"> 
    <div class="lessons_container card" v-for="item in render_map" :data-prop="item.prop" :key="item.prop">
      <div class="card-body">
         <h3>{{item.name}}</h3>
         <hr>
         <div class="lessons_list">
            <div 
                class="lesson" 
                v-for="lesson in lessons_plan[item.prop]" 
                :data-title="lesson.title"
                :data-id="lesson._id" 
                :key="lesson._id"
            >
              <div :title="lesson.title">{{cut_text(lesson.title, 50)}}</div>
              <div class="lesson_controls">
                <span class="edit_lesson_btn btn btn-warning" @click="on_lesson_edit(lesson._id)">
                  <i class="fa-solid fa-edit"></i>
                </span>  
                <span class="delete_lesson_btn btn btn-danger" @click="on_lesson_delete(lesson._id, item.prop)">
                  <i class="fa-solid fa-trash"></i>
                </span>
              </div>
            </div>
         </div>
      </div>
    </div>
    </template>
    <div class="lessons_plan_controls">
      <div class="btn btn-primary" @click="save_new_lessons_plan">Сохранить</div>
    </div>
  </div>
</template>

<script>
import Sortable from "sortablejs";
import {PHYSICS_COURSES, LESSONS_PLAN_FIELDS} from "@/assets/config/constants.js";
import Swal from "sweetalert2";
import {cut_text} from "@/assets/lib/helpers.js";
export default {
  data: function(){
    return {
      render_map: [],
      lessons_plan: null
    }
  },
  methods: {
    cut_text,
    init_sortable_lists(){
      document.querySelectorAll(".lessons_list").forEach((i)=>{
        new Sortable(i, {group: "lessons"});
      });
    },
    init_render_map(){
      const render_map = [{prop: "unused", name: "Нераспределенные уроки"}];
      for(const course of PHYSICS_COURSES){
        render_map.push({prop: `course_${course}`, name: `${course} класс`});
      }
      this.render_map = render_map;    
    },
    async fetch_lessons_plan(){
      this.lessons_plan = await this.$api.lessons_plan();
    },
    get_new_lessons_plan(){
      const new_plan = {};
      LESSONS_PLAN_FIELDS.forEach(field => new_plan[field] = []);
      const lessons_containers = document.querySelectorAll(".lessons_container");
      lessons_containers.forEach(container => {
        const prop = container.dataset.prop;
        container.querySelectorAll(".lesson").forEach(lesson => {
          const {id, title} = lesson.dataset;
          new_plan[prop].push({_id: id, title});
        });
      });
      return new_plan;
    },
    on_lesson_edit(lesson_id){
      this.$router.push({name: "LessonEditor", params: {lesson_id}});
    },
    async on_lesson_delete(lesson_id, category){
      const {isConfirmed} = await Swal.fire({text: "Вы действительно хотите удалить урок?", showCancelButton: true});
      if(!isConfirmed) return;
      await this.$api.remove_lesson({lesson_id});
      const delete_index = this.lessons_plan[category].findIndex(lesson => lesson._id === lesson_id);
      this.lessons_plan[category].splice(delete_index, 1);
    },
    async save_new_lessons_plan(){
      const new_lessons_plan = this.get_new_lessons_plan();
      await this.$api.update_lessons_plan(new_lessons_plan);
      Swal.fire({text: "Учебный план успешно обновлен!", icon: "success"});
    }
  },
  async mounted(){
    this.init_render_map();
    await this.fetch_lessons_plan();
    this.init_sortable_lists();
  }
}
</script>

<style lang="scss" scoped>
.lessons_plan{
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
  padding: 1%;
  color: white;
  background-color: rgba(121, 106, 238, 0.9);
  margin-top: 1%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  &:first-child{
    margin-top: 0;
  }
}

.lessons_list{
  min-height: 50px;
}

.lesson_controls{
  display: flex;
  justify-content: space-around;
}

.lessons_plan_controls{
  margin-top: 1%;
  display: flex;
  justify-content: center;
}


@media (max-width: 600px) {
  .card-body{
    padding: 1%;
  }

  .lesson_controls{
    margin-left: 15%;
  }

  .lesson{
    padding-right: 10%;
    padding-left: 2%;
  }

  .delete_lesson_btn{
    margin-left: 5%;
  }

  .lessons_plan_controls{
    margin-top: 2%;
  }
}

@media (min-width: 420px) {
  .lesson{
    padding-right: 5%;
  }
}
</style>