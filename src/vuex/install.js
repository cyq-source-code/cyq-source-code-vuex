export let Vue;
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

export default install;
