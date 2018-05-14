/*
 * @Author: lincl
 * @Date:   2017-11-17 20:34:24
 * @Last Modified by:   lincl
 * @Last Modified time: 2017-11-17 20:34:32
 */
//课程相关
export default (BASEURL) => {
  return {
    // 获取上课安排 月数据
    getMonthListByCoach: BASEURL + 'api/manage/courseschedule/getMonthListByCoach',
    // 获取上课安排 周数据
    getWeekListByCoach: BASEURL + 'api/manage/courseschedule/getWeekListByCoach',
    // 获取团课列表
    getGroupCourseList: BASEURL + 'api/manage/groupcourse/getGroupCourseList',
    // 新增编辑团课
    addOrEditGroupCourse: BASEURL + 'api/manage/groupcourse/addOrEditGroupCourse',
    // 删除团课
    deleteGroupCourse: BASEURL + 'api/manage/groupcourse/deleteGroupCourse',
    // 导出团课
    exportGroupCourseList: BASEURL + 'api/manage/groupcourse/exportGroupCourseList',
    // 团课详情
    getGroupCourseDetail: BASEURL + 'api/manage/groupcourse/getGroupCourseDetail',
    // 私教课-列表
    getCourseList: BASEURL + 'api/manage/course/getCourseList',
    // 私教课-新增、编辑
    addOrEditCourse: BASEURL + 'api/manage/course/addOrEditCourse',
    // 私教课-删除
    deleteCourse: BASEURL + 'api/manage/course/deleteCourse',
    // 私教课-详情
    getCourseDetail: BASEURL + 'api/manage/course/getCourseDetail',
    // 获取课程名称列表
    getGroupCourseNameList: BASEURL + 'api/manage/groupcourse/getGroupCourseNameList',
    // 获取私教课和团课课程名称列表
    getAllCourseNameList: BASEURL + 'api/manage/course/getAllCourseNameList',
    // 获取私教课列表
    getCourseNameList: BASEURL + 'api/manage/course/getCourseNameList',
    // 导出私教课列表
    exportCourseList: BASEURL + 'api/manage/course/exportCourseList',
    // 私教课启停用
    updateCourseStatus: BASEURL + 'api/manage/course/updateCourseStatus',
    // 视频课程初始化
    letvinit: BASEURL + 'api/manage/video/letvinit',
    // 视频课程-列表
    videolist: BASEURL + 'api/manage/video/list',
    // 视频课程-新增
    videoSave: BASEURL + 'api/manage/video/save',
    // 视频课程-详情
    videoDetail: BASEURL + 'api/manage/video/detail',
    // 视频课程-删除
    videodelete: BASEURL + 'api/manage/video/delete',
    // 获取私教课程名称列表
    getDistinctCourseNameList: BASEURL + 'api/manage/course/getDistinctCourseNameList',
    // 获取团课课程名称列表
    getDistinctGroupCourseNameList: BASEURL + 'api/manage/groupcourse/getDistinctGroupCourseNameList',
    //******************************分割线************************************
    // 京东众筹会员相关
    getCrowdfundinglist: BASEURL + 'api/manage/crowdfunding/list',
    // 根据id获取生活馆记录
    getmylifehouse: BASEURL + 'api/manage/lifehouse/getmylifehouse',
    // 众筹数据导出
    crowdfundingExport: BASEURL + 'api/manage/crowdfunding/export',
    // 众筹数据导入
    dataInput: BASEURL + 'api/manage/crowdfunding/dataInput',
    // 获取未发货大区列表
    getDeliveryAreas: BASEURL + 'api/manage/crowdfunding/getDeliveryAreas',
    // 获取未发货生活馆列表
    getDeliveryLifehouses: BASEURL + 'api/manage/crowdfunding/getDeliveryLifehouses',
    // 众筹发货
    deliver: BASEURL + 'api/manage/crowdfunding/deliver',
    // 角色相关
    roleList: BASEURL + 'api/manage/role/roleList'
  }
}
