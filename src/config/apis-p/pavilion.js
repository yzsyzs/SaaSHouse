export default (BASEURL) => {
  return {
    // 新增编辑场馆
    addOrEditLifeHouse: BASEURL + 'api/manage/lifehouse/addOrEditLifeHouse',
    // 删除场馆
    deleteLifeHouse: BASEURL + 'api/manage/lifehouse/deleteLifeHouse',
    // 到处场馆列表为excel表
    exportLifeHouseList: BASEURL + 'api/manage/lifehouse/exportLifeHouseList',
    // 查询场馆详情
    getLifeHouseDetail: BASEURL + 'api/manage/lifehouse/getLifeHouseDetail',
    // 场馆编辑获取场馆详情
    lifeDetail: BASEURL + 'api/manage/lifehouse/lifeDetail',
    // 查看场馆列表
    getLifeHouseList: BASEURL + 'api/manage/lifehouse/getLifeHouseList'
  }
}
