import install from "./install";
import ModuleCollection from "./module/module-collection";

class Store {
  constructor(options) {
    // 将选项格式化
    this._modules = new ModuleCollection(options);
    console.log(this._modules);
  }
}

export default {
  Store,
  install,
};
