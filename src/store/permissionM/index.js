import state from './state'
// 这里做个说明，因为涉及到权限这块主要是获取后台返回的数据进行显示，目前业务不支持修改权限，所以只需要在状态树中注入 getter就可以
// import mutations from './mutations'
// import * as actions from './actions'
import * as getters from './getters'
export default {
  // 命名空间，这样每个模块的状态独立，目前不用用到
  // namespaced: true,
  state,
  // mutations,
  // actions,
  getters
}
