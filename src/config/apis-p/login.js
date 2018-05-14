export default (BASEURL) => {
  return {
    // 验证账号登录
    login: BASEURL + 'api/manage/login',
    // 访问权限接口
    access: BASEURL + "api/manage/access",
    // 二维码登录验证
    validateIdentifier: BASEURL + `api/manage/validateIdentifier`,
    // 获取二维码 验证信息
    generateQrCodeUrl: BASEURL + 'api/manage/login/generateQrCodeUrl',
    // 二维码 注销
    removeIdentifier: BASEURL + 'api/manage/login/removeIdentifier',
    // 二维码 多馆进入生活馆接口
    scanAccess: BASEURL + 'api/manage/scanAccess',
    // 进入生活馆 获取验证码
    sendCode: BASEURL + 'api/manage/sendCode',
    // 进入生活馆
    enterLife: BASEURL + 'api/manage/access',
    // 忘记, 修改密码
    forgetOrUpdate: BASEURL + 'api/manage/password/forgetOrUpdate',
    /* 系统配置 start */

    // 角色列表
    rolesAndUsers: `${BASEURL}api/manage/role/rolesAndUsers`,
    // 新增角色
    addRole: `${BASEURL}api/manage/role/addRole`,
    // 删除角色
    deleteRole: `${BASEURL}api/manage/role/deleteRole`,
    // 修改角色
    editRole: `${BASEURL}api/manage/role/editRole`,
    // 保存方法
    distributeResource: `${BASEURL}api/manage/role/distributeResource`,
    // 资源列表
    roleResource: `${BASEURL}api/manage/resource/roleResource`,
    // 操作日志
    logList: `${BASEURL}api/manage/log/list`
    /* 系统配置 end */
  }
}
