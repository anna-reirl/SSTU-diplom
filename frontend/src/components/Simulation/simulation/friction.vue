<template>
  <main>
    <SimulationPageHeader title="Трение" />
    <div id="view">
      
      <canvas id="simulation"></canvas>
      <SimulationControls :simulationOptions="simulationOptions" />
    </div>
  </main>
</template>

<script>
import SimulationPageHeader from "../components/SimulationPageHeader";
import SimulationControls from "../components/SimulationControls/SimulationControls.component.vue";
const frictionModule = import("../utils/friction.matter");

export default {
  components: {
    SimulationPageHeader,
    SimulationControls,
  },
  data() {
    return {
      simulationOptions: {
        gravityMultiplier: {
          label: "Гравитация",
          id: 1,
          defaultValue: 1,
          min: 0,
          max: 5,
          step: 0.5,
        },
        friction: {
          label: "Трение",
          id: 2,
          defaultValue: 0.25,
          min: 0,
          max: 1,
          step: 0.01,
        },
        frictionStatic: {
          label: "Статическое Трение",
          id: 3,
          defaultValue: 0.1,
          min: 0,
          max: 2,
          step: 0.05,
        },
        angleOfInclination: {
          label: "Угол наклона",
          id: 4,
          defaultValue: 5,
          min: 0,
          max: 45,
          step: 1,
        },
      },
    };
  },
  computed: {
    simulationOptionsValue() {
      return this.$store.state.simulation_options;
    }
  },
  watch: {
    async simulationOptionsValue(newOptions) {
      const { initializeFriction } = await frictionModule;
      initializeFriction(newOptions);
    },
  },
  async mounted() {
    await this.rewind();
  },
  methods: {
    async rewind() {
      const { initializeFriction } = await frictionModule;
      initializeFriction(this.simulationOptionsValue);
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  margin-top: 2rem;

  #view {
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    width: 80%;
    
    canvas#simulation {
      border: rgb(165, 165, 165) solid 0.1rem;
    }
  }
}

@media (max-width: 992px) {
  #view{
    flex-direction: column;
  }

  #controls{
    width: 100%;
  }
}
</style>
