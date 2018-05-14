/*
 * @Author: lincl
 * @Date:   2017-12-7 14:12:02
 * @Last Modified by:   lincl
 * @Last Modified time: 2017-12-7 14:12:06
 */
export default (BASEURL) => {
  return {
    //预约记录
    getPreorderList: BASEURL + "api/manage/preorder/getPreorderList",
    // 取消预约
    cancelCoursePreorder: BASEURL + "api/manage/preorder/cancelCoursePreorder",
    // 代约私教课列表
    getPresonalCourseList: BASEURL + "api/manage/preorder/getPresonalCourseList",
    // 代约私教课
    preorderMulti: BASEURL + "api/manage/preorder/preorderMulti",
    //签到记录
    getCourseSignList: BASEURL + "api/manage/preorder/getCourseSignList",
    //导出签到记录
    exportCourseSignList: BASEURL + "api/manage/preorder/exportCourseSignList",
    //团课预约课程
    appPreorderMulti: BASEURL + "api/manage/preorder/appPreorderMulti",
    //私教课预约
    preorderMulti: BASEURL + "api/manage/preorder/preorderMulti",
    //签到、
    courseSign: BASEURL + "api/manage/preorder/courseSign",
    //取消课程 
    cancelCourseSchedule: BASEURL + "api/manage/preorder/cancelCourseSchedule",   
    //导出预约记录
    exportPreorderList: BASEURL + "api/manage/preorder/exportPreorderList",
  }
}
