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
  },
  modules: {
    a: {
      // namespaced: true, // 划分模块
      state: {
        age: 10,
      },
      getters: {
        getAge(state) {
          return state.age + 30;
        },
        getCount(state) {
          return state.count + 100;
        },
      },
      mutations: {
        addAge(state, payload) {
          state.age += payload;
        },
      },
      actions: {
        addAgeAction(context, payload) {
          context.commit("addAge", payload);
        },
      },
      modules: {
        aa: {
          // namespaced: true,
          state: {
            age: 50,
          },
        },
      },
    },
    b: {
      // namespaced: true, // 划分模块
      state: {
        age: 60,
      },
    },
  },
});
