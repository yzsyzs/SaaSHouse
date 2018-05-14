/*
 * @Author: lincl
 * @Date:   2017-11-24 14:46:54
 * @Last Modified by:   lincl
 * @Last Modified time: 2017-11-24 14:46:59
 */
export default(BASEURL) => {
  return {
    //员工相关******************************
    //新增修改员工
    saveEmployee: BASEURL + "api/manage/employee/saveEmployee",
    //员工列表
    employeeList: BASEURL + "api/manage/employee/employeeList",
    //员工详情
    employeeDetail: BASEURL + "api/manage/employee/employeeDetail",
    //导师、教练详情
    coachDetail: BASEURL + "api/manage/employee/coachDetail",
    //冻结或者还原员工状态
    updateState: BASEURL + "api/manage/employee/updateState",
    //冻结还原教练-导师
    updateCoachState: BASEURL + "api/manage/employee/updateCoachState",   
    //保存教练-导师
    saveCoach: BASEURL + "/api/manage/employee/saveCoach",   
    //获取生活馆列表
    getLifeNameList: BASEURL + "api/manage/lifehouse/getLifeNameList",
    //新增标签
    addTag: BASEURL + "api/manage/employee/addTag",
    //标签列表
    tagList: BASEURL + "api/manage/employee/tagList",
    //删除标签
    deleteTag: BASEURL + "api/manage/employee/deleteTag",
    //根据猫号手机号查询用户
    //角色列表
    roleList: BASEURL + "api/manage/role/roleList",
    //导师-教练列表
    coachList: BASEURL + "api/manage/employee/coachList",
    //获取生活馆下面的教练
    findCoachByLife: BASEURL + "api/manage/employee/findCoachByLife",    
    //获取专家类别
    expertList: BASEURL + "api/manage/employee/expertList", 
    //获取生活馆下的销售
    findSaleByLife: BASEURL + "api/manage/employee/findSaleByLife", 
  }
}