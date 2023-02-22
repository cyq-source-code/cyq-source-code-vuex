import Vue from "vue";
// import Vuex from "vuex";
import Vuex from "../vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0,
  },
  getters: {
    getCount(state) {
      console.log(12312);
      return state.count + 100;
    },
  },
  mutations: {
    addCount(state, payload) {
      state.count += payload;
    },
  },
  actions: {
    addCountAction(context, payload) {
      setTimeout(() => {
        context.commit("addCount", payload);
      }, 1000);
    },
    mulCountAction(context, payload) {
      setTimeout(() => {
        context.commit("addCount", payload);
      }, 1000);
    },
  },
  modules: {},
});
