export default (BASEURL) => {
  return {
    // 统计所有的场馆给定时间段内的所有的数据
    allData: `${BASEURL}api/manage/lifehouse/data`,
    // 导出表格
    exportData: `${BASEURL}api/manage/lifehouse/export`,
    // 分页统计数据
    pageStatistics: `${BASEURL}api/manage/lifehouse/page/statistics`,
    // 统计签到的用户数量（扇形图）
    signUser: `${BASEURL}api/manage/lifehouse/sign/user`,
    mapChina: `${BASEURL}api/manage/lifehouse/info`
  }
}
