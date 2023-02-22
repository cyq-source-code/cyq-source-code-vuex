export let Vue;
class Store {
  constructor(options) {
    let state = options.state;
    let getters = options.getters;
    let mutations = options.mutations;
    let actions = options.actions;

    this.getters = {};
    const computed = {};

    Object.keys(getters).forEach((getterKey) => {
      // 使用计算属性缓存，避免重复执行
      computed[getterKey] = () => {
        return getters[getterKey](this.state);
      };
      Object.defineProperty(this.getters, getterKey, {
        get: () => {
          return this._vm[getterKey];
          //   return getters[getterKey](state);
        },
      });
    });

    // 响应式数据
    // vuex 完全依赖 Vue
    this._vm = new Vue({
      // $符号不会被直接获取
      data: {
        $$state: state,
      },
      computed,
    });

    this.mutations = mutations;
    this.actions = actions;
  }
  get state() {
    return this._vm._data.$$state;
  }

  // 箭头函数（this指向）
  commit = (type, payload) => {
    this.mutations[type](this.state, payload);
  };
  dispatch = (type, payload) => {
    this.actions[type](this, payload);
  };
}

const install = (_Vue) => {
  Vue = _Vue;

  Vue.mixin({
    // 让所有组件都定义$store
    beforeCreate() {
      const options = this.$options;
      if (options.store) {
        // 根
        this.$store = options.store;
      } else if (this.$parent && this.$parent.$store) {
        this.$store = this.$parent.$store;
      }
    },
  });
};
export default {
  Store,
  install,
};
