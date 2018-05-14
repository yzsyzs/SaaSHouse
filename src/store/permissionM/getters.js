/**
 * 参考连接： https://vuex.vuejs.org/zh-cn/getters.html
 * Vuex 允许我们在 store 中定义“getter”（可以认为是 store 的计算属性）。
 * 就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。
 */
/* 工作台 start */
// 搜索权限
export const classSetSearch = state => state.classSetSearch
/* 工作台 end */
/* 课程表 start */
// 搜索权限
export const scheduleSearch = state => state.scheduleSearch
// 每日排课 查看每日排课
export const dayCurriculumSearch = state => state.dayCurriculumSearch
// 判断教练在这个时间段内是否有排班
export const dayCurriculumCoachHInC = state => state.dayCurriculumCoachHInC
// 添加每日排课权限
export const dayCurriculumAdd = state => state.dayCurriculumAdd
// 编辑每日排课更新授课教练的权限
export const dayCurriculumUpdTName = state => state.dayCurriculumUpdTName
// 删除每日排课的权限
export const dayCurriculumDel = state => state.dayCurriculumDel
/* 课程表 end */

/* 场馆相关 start */
// 查询场馆权限
export const pavilionSetSearch = state => state.pavilionSetSearch
// 场馆详情权限
export const pavilionSetDetail = state => state.pavilionSetDetail
// 新增编辑场馆权限
export const pavilionSetAddOrEdit = state => state.pavilionSetAddOrEdit
// 删除场馆权限
export const pavilionSetDel = state => state.pavilionSetDel
// 导出场馆权限
export const pavilionSetExport = state => state.pavilionSetExport
/* 场馆相关 end */

/* 特权卡相关 start */
// 查询特权卡权限
export const vipCardSearch = state => state.vipCardSearch
// 特权卡详情权限
export const vipCardDetail = state => state.vipCardDetail
// 删除特权卡
export const vipCardDel = state => state.vipCardDel
// 保存特权卡权限
export const vipCardSave = state => state.vipCardSave
// 启用停用权限
export const vipCardUpStatus = state => state.vipCardUpStatus
/* 特权卡相关 end */

/* 管理员相关 start */
// 查询场馆管理员列表
export const administratorSearch = state => state.administratorSearch
// 新增或编辑场馆管理员
export const administratorAddOrEdit = state => state.administratorAddOrEdit
// 删除管理员
export const administratorDel = state => state.administratorDel
// 导出场馆管理员列表为excel表
export const administratorExport = state => state.administratorExport
// 查询管理员详情
export const administratorDetail = state => state.administratorDetail
/* 管理员相关 end */

/* 消费记录  start */
// 查询消费记录
export const consumptionManagementSearch = state => state.consumptionManagementSearch
// 核销核销记录导出（消费记录）
export const consumptionManagementExport = state => state.consumptionManagementExport
/* 消费记录  end */
