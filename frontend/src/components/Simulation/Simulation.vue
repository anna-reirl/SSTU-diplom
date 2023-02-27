<template>
  <div>
    <section id="collection">
      <h2 id="collection" class="title gradient fade-up text-center">Все Симуляции</h2>

      <div id="collection-grid">
        <SimulationPreview
          v-for="simulationPreview in simulationPreviews"
          :key="simulationPreview.id"
          :name="simulationPreview.name"
          :url="simulationPreview.url"
          :img="simulationPreview.img"
          @click="switch_lab(simulationPreview.lab_id, $event)"
        />
      </div>

      <lab-view :cur_lab="cur_lab" />
    </section>
  </div>
</template>

<script>
import SimulationPreview from "./components/SimulationPreview";
import LabView from "./LabView.vue";

export default {
  components: {
    SimulationPreview,
    "lab-view": LabView
  },
  data(){
    return {
      cur_lab: null,
      simulationPreviews: [
        {
          id: "1",
          url: "/simulation/pendulum",
          name: "Колебания",
          lab_id: "pendulum",
          img: require("./static/img/preview/pendulum.png"),
        },
        {
          id: "2",
          url: "/simulation/air-resistance",
          name: "Сопротивление воздуха",
          lab_id: "air_resistance",
          img: require("./static/img/preview/air-resistance.jpg"),
        },
        {
          id: "3",
          url: "/simulation/friction",
          name: "Трение",
          lab_id: "friction",
          img: require("./static/img/preview/friction.jpg"),
        },
      ],
    };
  },
  methods: {
    switch_lab(lab_id, lab_name){
      if(this.cur_lab === lab_id) this.cur_lab = null;
      else this.cur_lab = lab_id;
      this.$emit("switch_lab", {lab_id: this.cur_lab, lab_name});
    }
  }
};
</script>

<style lang="scss">
// Variables
$background-color: #151719;
$primary-dark: #2c5bd1;
$text-primary: #eceded;
$primary: #4d7bf2;
$gray: #393939;

$rounded-sm: 0.25rem;
$rounded-base: 0.5rem;
$rounded-lg: 1rem;

$screen-sm: 350px;
$screen-md: 768px;

#hero {
  max-width: 800px;
  min-height: 100vh;

  margin: 0 auto;
  margin-top: 3rem;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;

  p {
    margin: 0 25%;
    margin-top: 2.5rem;
    margin-bottom: 1.5rem;
  }

  #cta {
    display: flex;
    gap: 1rem;

    button.button {
      width: 10rem;

      &.blue {
        background-color: $primary;
      }
    }
  }

  canvas {
    margin-top: 2.5rem;
  }

  @for $i from 0 to 10 {
    .fade-up:nth-child(#{$i + 1}) {
      opacity: 0;
      animation: fade-up
        1.5s
        cubic-bezier(0.215, 0.61, 0.355, 1)
        $i *
        0.25s +
        0.1s
        forwards;
    }
  }
}

#collection {
  #collection-grid {
    display: grid;
    max-width: 1200px;
    grid-template-columns: auto auto auto;
    margin: 0 auto;
    margin-top: 2.5rem;
    padding: 0 1rem;
    gap: 2rem;

    @media screen and (max-width: $screen-md) {
      & {
        grid-template-columns: auto auto;
      }
    }
  }
}

@keyframes fade-up {
  0% {
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
  }
}


@media (max-width: 600px) {
  #collection #collection-grid{
    display: flex;
    flex-direction: column;
  }
}
</style>
