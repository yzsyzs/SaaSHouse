import { api } from '@/config/api'
export default (fn) => {
  return {
    /* 工作台 start */
    // 搜索权限
    classSetSearch: fn(api.getMonthListByCoach),
    /* 工作台 end */

    /* 课程表 start */
    // 搜索权限
    scheduleSearch: fn(api.getMonthCourseScheduleList),
    // 每日排课 查看每日排课
    dayCurriculumSearch: fn(api.getDailyCourseScheduleList),
    // 判断教练在这个时间段内是否有排班
    dayCurriculumCoachHInC: fn(api.coachHasInClass),
    // 添加每日排课权限
    dayCurriculumAdd: fn(api.scheduleAdd),
    // 编辑每日排课更新授课教练的权限
    dayCurriculumUpdTName: fn(api.updateTrainerName),
    // 删除每日排课的权限
    dayCurriculumDel: fn(api.scheduleDelete),
    /* 课程表 end */

    /* 场馆相关 start */
    // 查询场馆权限
    pavilionSetSearch: fn(api.getLifeHouseList),
    // 场馆详情权限
    pavilionSetDetail: fn(api.lifeDetail),
    // 新增编辑场馆权限
    pavilionSetAddOrEdit: fn(api.addOrEditLifeHouse),
    // 删除场馆权限
    pavilionSetDel: fn(api.deleteLifeHouse),
    // 导出场馆权限
    pavilionSetExport: fn(api.exportLifeHouseList),
    /* 场馆相关 end */

    /* 特权卡相关 start */
    // 查询特权卡权限
    vipCardSearch: fn(api.getCardList),
    // 特权卡详情
    vipCardDetail: fn(api.getCardDetail),
    // 删除特权卡权限
    vipCardDel: fn(api.deleteCard),
    // 保存特权卡权限
    vipCardSave: fn(api.saveCard),
    // 启用停用特权卡权限
    vipCardUpStatus: fn(api.updateCardStatus),
    /* 特权卡相关 end */

    /* 管理员相关 start */
    // 查询场馆管理员列表权限
    administratorSearch: fn(api.getAdminInfoList),
    // 新增或编辑场馆管理员权限
    administratorAddOrEdit: fn(api.addOrEditLifeAdmin),
    // 删除管理员权限
    administratorDel: fn(api.deleteAdmin),
    // 导出场馆管理员列表为excel表权限
    administratorExport: fn(api.exportAdminInfoList),
    // 查询管理员详情权限
    administratorDetail: fn(api.getAdminInfoDetail),
    /* 管理员相关 end */

    /* 消费记录  start */
    // 查询消费记录权限
    consumptionManagementSearch: fn(api.getCourseConsumeList),
    // 核销核销记录导出（消费记录）权限
    consumptionManagementExport: fn(api.courseConsumeListExport)
    /* 消费记录  end */
  }
}
