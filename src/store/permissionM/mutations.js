/**
 * 参考连接： https://vuex.vuejs.org/zh-cn/mutations.html
 * 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
 */
import * as types from './mutation-types'
const mutations = {
  [types.SET_CLASS_SET_SEARCH] (state, classSetSearch) { state.classSetSearch = classSetSearch },
  [types.SET_SCHEDULE_SEARCH] (state, scheduleSearch) { state.scheduleSearch = scheduleSearch }
}
export default mutations
