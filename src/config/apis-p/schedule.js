/**
 * 课程表相关接口
 */
export default (BASEURL) => {
  return {
    // 添加团课排班
    scheduleAdd: BASEURL + 'api/manage/courseschedule/add',
    // 删除排班信息
    scheduleDelete: BASEURL + 'api/manage/courseschedule/delete',
    // 获取排班信息
    getCourseSchedule: BASEURL + 'api/manage/courseschedule/getCourseSchedule',
    // 每日排班
    getDailyCourseScheduleList: BASEURL + 'api/manage/courseschedule/getDailyCourseScheduleList',
    // 团课课程表 [月]
    getMonthCourseScheduleList: BASEURL + 'api/manage/courseschedule/getMonthCourseScheduleList',
    // 团课课程表 [周]
    getWeekCourseScheduleList: BASEURL + 'api/manage/courseschedule/getWeekCourseScheduleList',
    // 更新排班的授课教师
    updateTrainerName: BASEURL + 'api/manage/courseschedule/updateTrainerName',
    // 判断教练在这个时间段内是否有排班
    coachHasInClass: BASEURL + 'api/manage/coach/hasInClass'
  }
}
