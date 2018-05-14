/**
 * 管理员接口
 * @作者: chanwefun
 */
export default (BASEURL) => {
  return {
    // 新增或编辑场馆管理员
    addOrEditLifeAdmin: BASEURL + 'api/manage/pubuser/addOrEditLifeAdmin',
    // 删除管理员
    deleteAdmin: BASEURL + 'api/manage/pubuser/deleteAdmin',
    // 导出场馆管理员列表为excel表
    exportAdminInfoList: BASEURL + 'api/manage/pubuser/exportAdminInfoList',
    // 查询管理员详情
    getAdminInfoDetail: BASEURL + 'api/manage/pubuser/getAdminInfoDetail',
    // 查询场馆管理员列表
    getAdminInfoList: BASEURL + 'api/manage/pubuser/getAdminInfoList',
    // 获取用户信息
    getSsoUser: BASEURL + 'api/manage/pubuser/getSsoUser'
  }
}
