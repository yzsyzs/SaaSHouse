/**
 * 参考链接：https://vuex.vuejs.org/zh-cn/intro.html
 * Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。
 * 它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。
 * Vuex 也集成到 Vue 的官方调试工具 devtools extension，提供了诸如零配置的 time-travel 调试、状态快照导入导出等高级调试功能。
 */
import Vue from 'vue'
import Vuex from 'vuex'
// 权限模块
import permissionM from './permissionM/index'
// 在控制台打印日志
import createLogger from 'vuex/dist/logger'
Vue.use(Vuex)
const isDev = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  // 由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿
  // 为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。
  // 每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割：
  modules: {
    pM: permissionM
  },
  strict: isDev,
  plugins: isDev ? [createLogger()] : []
})
