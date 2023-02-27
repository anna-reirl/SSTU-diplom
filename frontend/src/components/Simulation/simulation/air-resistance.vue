<template>
  <main>
    <SimulationPageHeader title="Сопротивление Воздуха" />
    <div id="view">
      <canvas id="simulation"></canvas>
      <SimulationControls :simulationOptions="simulationOptions" />
    </div>
  </main>
</template>

<script>
import SimulationPageHeader from "../components/SimulationPageHeader";
import SimulationControls from "../components/SimulationControls/SimulationControls.component.vue";
const airResistanceModule = import("../utils/air-resistance.matter");

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
        frictionAir: {
          label: "Сопротивление воздуха",
          id: 3,
          defaultValue: 0.05,
          min: 0.0001,
          max: 1,
          step: 0.05,
        },
        size: {
          label: "Размер коробка",
          id: 4,
          defaultValue: 50,
          min: 10,
          max: 100,
          step: 1,
        },
      },
    };
  },
  computed: {
    simulationOptionsValue() {
      return this.$store.state.simulation_options;
    },
  },
  watch: {
    async simulationOptionsValue(newOptions) {
      const { initializeAirResistance } = await airResistanceModule;
      initializeAirResistance(newOptions);
    },
  },
  async mounted() {
    await this.rewind();
  },
  methods: {
    async rewind() {
      const { initializeAirResistance } = await airResistanceModule;
      initializeAirResistance(this.simulationOptionsValue);
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
