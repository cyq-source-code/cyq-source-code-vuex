<template>
  <div id="app">
    <button @click="$store.state.count++">直接修改</button>
    <button @click="$store.commit('addCount', 2)">commit</button>
    <button @click="$store.dispatch('addCountAction', 5)">dispatch</button>

    <div>{{ this.$store.state.count }}</div>
    <div>{{ this.$store.getters.getCount }}</div>
    <hr />
    <div>module a</div>
    <button @click="$store.state.a.age++">直接修改</button>
    <button @click="$store.commit('a/addAge', 2)">commit</button>
    <button @click="$store.dispatch('a/addAgeAction', 5)">dispatch</button>
    <div>{{ this.$store.state.a.age }}</div>
    <div>{{ this.$store.getters["a/getAge"] }}</div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
