import Vue from "vue";
import Vuex from 'vuex';

import mutations from "@/store/mutations";
import actions from "@/store/actions";
// 安装插件
Vue.use(Vuex)

// 创建Store对象
const store = new Vuex.Store({
  state: {
    cartList: []
  },
  mutations,
  actions
})

// 挂载Vue实例
export default store

