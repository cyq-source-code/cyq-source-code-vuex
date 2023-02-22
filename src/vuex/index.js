import install from "./install";
import ModuleCollection from "./module/module-collection";

function installModule(store, rootState, path, rootModule) {
  if (path.length > 0) {
    // 根模块
  }

  rootModule.forEachMutation((key, value) => {
    store._mutations[key] = store._mutations[key] || [];
    store._mutations[key].push((payload) => {
      value(rootModule.state, payload);
    });
  });
  rootModule.forEachAction((key, value) => {
    store._actions[key] = store._actions[key] || [];
    store._actions[key].push((payload) => {
      value(store, payload);
    });
  });
  rootModule.forEachGetter((key, value) => {
    if (store._wrappedGetters[key]) {
      return console.warn(`${key}已经存在了`);
    }
    store._wrappedGetters[key] = () => {
      return value[rootModule.state];
    };
  });
  rootModule.forEachModule((key, value) => {
    installModule(store, rootState, path.concat(key), value);
  });
  console.log(store);
}
class Store {
  constructor(options) {
    // 将选项格式化
    this._modules = new ModuleCollection(options);
    console.log(this._modules);

    this._mutations = Object.create(null);
    this._actions = Object.create(null);
    this._wrappedGetters = Object.create(null); //存放计算属性

    const state = this._modules.root.state;
    installModule(this, state, [], this._modules.root);
  }
}

export default {
  Store,
  install,
};
