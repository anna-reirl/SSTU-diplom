<template>
<div>
      <!-- simulations -->
      <air-resistance v-if="cur_lab === 'air_resistance'"  />
      <pendulum v-if="cur_lab === 'pendulum'" />
      <friction v-if="cur_lab === 'friction'" />
</div>
</template>

<script>
export default {
    props: {
        cur_lab: {type: String}
    },
    components: {
        "air-resistance": () => import("./simulation/air-resistance.vue"),
        "pendulum": () => import('./simulation/pendulum.vue'),
        "friction": () => import("./simulation/friction.vue")
    }
}
</script>

<style>

</style>