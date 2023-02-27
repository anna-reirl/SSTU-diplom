<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import "@/assets/raw/vendor/bootstrap/js/bootstrap.bundle.min.js";
import "@/assets/raw/vendor/just-validate/js/just-validate.min.js";
import "@/assets/raw/vendor/choices.js/public/assets/scripts/choices.min.js";
export default {

}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Poppins:300,400,700");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css");
@import "@/assets/raw/vendor/choices.js/public/assets/styles/choices.min.css";
@import "@/assets/raw/css/style.default.min.css";
@import "@/assets/raw/css/custom.css";
@import url('https://fonts.googleapis.com/css2?family=Comfortaa&display=swap');
#app{
  min-height: 100vh;
}
</style>