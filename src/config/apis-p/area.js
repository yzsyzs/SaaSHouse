export default (BASEURL) => {
  return {
    //获取省市区 api/manage/region/getRegion/
    getArea: BASEURL + "api/manage/region/getRegion/",
    //获取所有大区
    getareas:BASEURL + "api/manage/region/getAreas",
    //根据大区获取省份
    getprovincesbyareaid:BASEURL + "api/manage/region/getProvinceByArea",
    //根据省份获取城市
    getregion:BASEURL + "api/manage/region/getRegion",
  }
}
