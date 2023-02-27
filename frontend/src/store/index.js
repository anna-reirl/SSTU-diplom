import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    simulation_options: {},
    user: {
      login: null,
      full_name: null,
      role: null
    }
  },
  getters: {
  },
  mutations: {
    set_user(state, new_user){
      Object.assign(state.user, new_user);
    },
    setOptions(state, newOptions) {
      state.simulation_options = { ...state.simulation_options, ...newOptions };
    },
    resetOptions(state) {
      state.simulation_options = {};
    },
  },
  actions: {
  },
  modules: {
  }
})
