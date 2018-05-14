export default (BASEURL) => {
  return {
    // 获取用户信息
    getSsoUser: BASEURL + "api/manage/pubuser/getSsoUser",
    // 得到管理员列表
    getAdminList: BASEURL + "api/manage/pubuser/getAdminList",
    // 获取团课课程名称列表
    getGroupCourseNameList: BASEURL + "api/manage/groupcourse/getGroupCourseNameList",
    //教练列表
    getCoachNameList: BASEURL + "api/manage/coach/getCoachNameList",
    // 获取生活馆名称列表
    getLifeNameList: BASEURL + "api/manage/lifehouse/getLifeNameList",
    //根据Id获取授权生活馆
    getLifehouseNames: BASEURL + "api/manage/lifehouse/getLifehouseNames",
  }
}
