<template>
  <main>
    <SimulationPageHeader title="Колебания" />
    <div id="view">
      <canvas id="simulation"></canvas>
      <SimulationControls :simulationOptions="simulationOptions" />
    </div>
  </main>
</template>

<script>
import SimulationPageHeader from "../components/SimulationPageHeader";
import SimulationControls from "../components/SimulationControls/SimulationControls.component.vue";
const pendulumModule = import("../utils/pendulum.matter");

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
          label: "Трение воздуха",
          id: 3,
          defaultValue: 0.5,
          min: 0,
          max: 1,
          step: 0.05,
        },
        damping: {
          label: "Затухание",
          id: 4,
          defaultValue: 0,
          min: 0,
          max: 1,
          step: 0.05,
        },
      },
      graphOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Time in seconds (T)",
                fontColor: "#fff",
                fontSize: 10,
              },
              ticks: {
                fontColor: "#fffE6",
                fontSize: 14,
                autoSkip: true,
                maxTicksLimit: 15,
              },
            },
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Velocity (v)",
                fontColor: "#fff",
                fontSize: 10,
              },
              ticks: {
                fontColor: "#fffE6",
                fontSize: 14,
              },
            },
          ],
        },
      },
      graphData: null,

      // The interval at which data is pushed to the graph
      // clear this interval after rerender
      interval: null,
    };
  },
  computed: {
    simulationOptionsValue() {
      return this.$store.state.simulation_options;
    }
  },
  watch: {
    async simulationOptionsValue(newOptions) {
      this.resetGraph();
      const { initializePendulum } = await pendulumModule; // DO this before clearing or might run into watch and mounted running simultaneously
      clearInterval(this.interval);
      this.interval = initializePendulum(this.addData, newOptions);
    },
  },
  async mounted() {
    this.resetGraph();
    const { initializePendulum } = await pendulumModule;
    this.interval = initializePendulum(this.addData, this.addData);
  },
  methods: {
    resetGraph() {
      this.graphData = {
        labels: [],
        datasets: [
          {
            label: "Velocity",
            borderColor: "#f87979",
            // borderWidth: 5,
            pointRadius: 0,
            data: [],
          },
        ],
      };
    },
    addData(x, y) {
      const newLabels = [...this.graphData.labels, x];
      const newData = [...this.graphData.datasets[0].data, y];
      if (newLabels.length > 100) {
        newLabels.shift();
        newData.shift();
      }
      this.graphData = {
        labels: newLabels,
        datasets: [
          {
            ...this.graphData.datasets[0],
            data: newData,
          },
        ],
      };
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
