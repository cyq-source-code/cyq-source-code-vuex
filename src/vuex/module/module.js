export default class Module {
  constructor(module) {
    this._raw = module;
    this._children = {};
    this.state = module.state;
  }

  addChild(key, module) {
    this._children[key] = module;
  }
  getChild(key) {
    return this._children[key];
  }
}
