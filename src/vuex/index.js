import install, { Vue } from "./install";
import ModuleCollection from "./module/module-collection";
import { forEachValue } from "./utils";

function getState(store, path) {
  return path.reduce((start, current) => {
    return start[current];
  }, store.state);
}

function installModule(store, rootState, path, rootModule) {
  if (path.length > 0) {
    // 根模块
    let parent = path.slice(0, -1).reduce((start, current) => {
      return start[current];
    }, rootState);

    store._withCommiting(() => {
      Vue.set(parent, path[path.length - 1], rootModule.state); // 响应式
    });
    // parent[path[path.length - 1]] = rootModule.state;
  }

  let namespaced = store._modules.getNamespace(path);
  // console.log(namespaced);
  rootModule.forEachMutation((key, value) => {
    store._mutations[namespaced + key] =
      store._mutations[namespaced + key] || [];
    store._mutations[namespaced + key].push((payload) => {
      // 修改 _commiting 的值
      store._withCommiting(() => {
        value(getState(store, path), payload);
      });
      store.subscribes.forEach((fn) => fn({ type: key, payload }, store.state)); // 插件
    });
  });
  rootModule.forEachAction((key, value) => {
    store._actions[namespaced + key] = store._actions[namespaced + key] || [];
    store._actions[namespaced + key].push((payload) => {
      let result = value(store, payload);
      return result;
    });
  });
  rootModule.forEachGetter((key, value) => {
    if (store._wrappedGetters[namespaced + key]) {
      return console.warn(`${key}已经存在了`);
    }
    store._wrappedGetters[namespaced + key] = () => {
      return value(getState(store, path));
    };
  });
  rootModule.forEachModule((key, value) => {
    installModule(store, rootState, path.concat(key), value);
  });
  console.log(store);
}

function resetStoreVM(store, state) {
  let oldVm = store._vm;
  const computed = {};
  const wrappedGetters = store._wrappedGetters;
  store.getters = {};
  forEachValue(wrappedGetters, (key, value) => {
    computed[key] = value;
    Object.defineProperty(store.getters, key, {
      get: () => {
        return store._vm[key];
      },
    });
  });
  store._vm = new Vue({
    data: {
      $$state: state,
    },
    computed,
  });
  if (store.strict) {
    store._vm.$watch(
      () => store._vm._data.$$state,
      () => {
        console.error(store._commiting, "不能在mutation外修改值");
      },
      { sync: true, deep: true } // 同步
    );
  }
  if (oldVm) {
    Vue.nextTick(() => oldVm.$destroy());
  }
}
class Store {
  constructor(options) {
    // 将选项格式化
    this._modules = new ModuleCollection(options);
    console.log(this._modules);

    this.strict = options.strict; // 是否是严格模式
    this._mutations = Object.create(null);
    this._actions = Object.create(null);
    this._wrappedGetters = Object.create(null); //存放计算属性
    this.plugins = options.plugins || [];

    this._commiting = false; // 判断是否是在mutation中改的值

    this.subscribes = [];

    const state = this._modules.root.state;
    installModule(this, state, [], this._modules.root);

    resetStoreVM(this, state);

    this.plugins.forEach((plugin) => plugin(this));
  }

  _withCommiting(fn) {
    this._commiting = true;
    fn();
    this._commiting = false;
  }

  replaceState(state) {
    this._withCommiting(() => {
      this._vm._data.$$state = state;
    });
  }

  commit = (type, payload) => {
    if (this._mutations[type]) {
      this._mutations[type].forEach((fn) => fn.call(this, payload));
    }
  };

  dispatch = (type, payload) => {
    // console.log(this._actions, type);
    // console.log(this._actions[type]);
    if (this._actions[type]) {
      return Promise.all(
        this._actions[type].map((fn) => fn.call(this, payload))
      );
      // this._actions[type].forEach((fn) => fn.call(this, payload));
    }
  };

  registerModule(path, module) {
    this._modules.register(path, module);
    installModule(this, this.state, path, module.newModule);
    resetStoreVM(this, this.state); // 计算属性（getters）不生效问题
  }

  get state() {
    return this._vm._data.$$state;
  }

  subscribe(fn) {
    this.subscribes.push(fn);
  }
}

export default {
  Store,
  install,
};
