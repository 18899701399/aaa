<template>
  <div id="app">
    <keep-alive exclude="Detail">
      <router-view></router-view>
    </keep-alive>
    <main-tab-bar></main-tab-bar>
  </div>
</template>

<script>
import MainTabBar from "@/components/content/maintabbar/MainTabBar";
// import 'bootstrap/dist/js/bootstrap.min'
export default {
  name: 'App',
  components: {
    MainTabBar
  }
}
</script>

<style>
@import "./assets/css/base.css";
/*@import "../node_modules/bootstrap/dist/css/bootstrap.min.css";*/

</style>
