<template>
  <div class="login-page">
    <div class="container d-flex align-items-center position-relative py-5">
      <div class="card shadow-sm w-100 rounded overflow-hidden bg-none">
        <div class="card-body p-0">
          <div class="row gx-0 align-items-stretch">
            <!-- Logo & Information Panel-->
            <div class="col-lg-6">
              <div class="info d-flex justify-content-center flex-column p-4 h-100">
                <div class="py-5">
                  <h1 class="display-6 fw-bold school_name">Vector</h1>
                  <p class="fw-light mb-0 description">Интерактивная школа физики</p>
                  <p class="fw-light mb-0 description_slogan">Заниматься физикой еще не было так просто!</p>
                </div>
              </div>
            </div>
            <!-- Form Panel    -->
            <div class="col-lg-6 bg-white">
              <div class="d-flex align-items-center px-4 px-lg-5 h-100">
                <form class="login-form py-5 w-100">
                  <div class="input-material-group mb-3">
                    <input v-model="login" class="input-material" type="text">
                    <label class="label-material">Логин</label>
                  </div>
                  <div class="input-material-group mb-4">
                    <input v-model="password" class="input-material" type="password">
                    <label class="label-material">Пароль</label>
                  </div>
                  <button @click.prevent="signin" class="btn btn-primary mb-3" type="submit">Войти</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center position-absolute bottom-0 start-0 w-100 z-index-20">

    </div>
  </div>
</template>

<script>
import AlertError from "@/assets/lib/AlertError";
import {activate_material_inputs} from "@/assets/lib/activate_material_inputs";
export default {
  data: function(){
    return {
      login: null,
      password: null
    }
  },
  methods: {
    async signin(){
        const {login, password} = this;
        if(!login || !password) throw new AlertError("Пожалуйста заполните все поля!");
        const {full_name, role} = await this.$api.signin({login, password});
        this.$store.commit("set_user", {login, full_name, role});
        if(role === "admin") this.$router.push({name: "AdminUsers"});
        if(role === "teacher") this.$router.push({name: "LessonsPlan"});
        if(role === "student") this.$router.push({name: "StudentLessons"});
    }
  },
  mounted(){
    activate_material_inputs();
  }
}
</script>

<style lang="scss">
.description{
  font-family: 'Comfortaa', cursive;
  font-size: 25px;
  border-bottom: 1px solid white;
}

.description_slogan{
  font-family: 'Comfortaa', cursive;
  font-size: 18px;
  margin-top: 1%;
}

 @media (max-width: 768px) {
    .school_name{
      text-align: center;
    }

    .description{
      font-size: 13px;
      text-align: center;
    }

    .description_slogan{
      font-size: 15px;
      text-align: center;
    }
 }

 @media(min-width: 420px) {
    .description{
      font-size: 17px;
    }
 }

@media (min-width: 992px) and (max-width: 1199px){

    .description_slogan{
      font-size: 14px;
    }
}
</style>