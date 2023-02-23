import Vue from "vue";
// import Vuex from "vuex";
import Vuex from "../vuex";

Vue.use(Vuex);
const logger = (store) => {
  console.log(store);
  let prevState = JSON.parse(JSON.stringify(store.state));
  store.subscribe((mutation, rootState) => {
    let nextState = JSON.parse(JSON.stringify(rootState));
    console.log(mutation, prevState);
    console.log(mutation, nextState);
    prevState = nextState;
  });
};

const persisPlugin = function (store) {
  let state = localStorage.getItem("VUEX");
  if (state) {
    store.replaceState(JSON.parse(state));
  }
  store.subscribe(function (mutationType, rootState) {
    localStorage.setItem("VUEX", JSON.stringify(rootState));
  });
};
const store = new Vuex.Store({
  plugins: [persisPlugin, logger],
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
      namespaced: true, // 划分模块
      state: {
        age: 10,
      },
      getters: {
        getAge(state) {
          return state.age + 30;
        },
        // getCount(state) {
        //   return state.count + 100;
        // },
      },
      mutations: {
        addAge(state, payload) {
          state.age += payload;
        },
      },
      actions: {
        addAgeAction(context, payload) {
          context.commit("a/addAge", payload);
          // context.commit("addAge", payload); // 此处有bug
        },
      },
      modules: {
        aa: {
          namespaced: true,
          state: {
            age: 50,
          },
        },
      },
    },
    b: {
      namespaced: true, // 划分模块
      state: {
        age: 60,
      },
    },
  },
});
store.registerModule(["a", "e"], {
  namespaced: true,
  state: {
    age: "e100",
  },
  getters: {
    eAge(state) {
      return state.age + "~~";
    },
  },
  mutations: {
    add(state) {
      state.age += "!";
    },
  },
});
export default store;
