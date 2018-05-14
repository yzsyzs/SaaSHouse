export default (BASEURL) => {
  return  {
      // 分销设置
      setConfigFromJoinAndQualificationAndRatio: BASEURL + "api/manage/distribution/setConfigFromJoinAndQualificationAndRatio",
      setConfigFromJoinAndQualificationAndRatioUrl:  "api/management/setConfigFromJoinAndQualificationAndRatio",
      // 获取分销设置
      getConfigFromJoinAndQualificationAndRatio: BASEURL +  "api/manage/distribution/getConfigFromJoinAndQualificationAndRatio",
      getConfigFromJoinAndQualificationAndRatiourl:  "api/management/getConfigFromJoinAndQualificationAndRatio",
      //积分余额
      getIntegralRemain: BASEURL +  "api/manage/distribution/getIntegralRemain",
      getIntegralRemainUrl:  "api/management/userDistribution/getIntegralRemain",
      // 获取亲友网络（上级和下级）
      getRelativesAll: BASEURL +  "api/manage/distribution/getRelativesAll",
      getRelativesAllUrl:  "api/management/userDistributions/getRelativesAll",
      //积分贡献统计
      getStatisticalIntegral: BASEURL +  "api/manage/distribution/getStatisticalIntegral",
      getStatisticalIntegralUrl:  "api/management/userDistributions/getStatisticalIntegral",
      //积分流水
      adminIntegral:  BASEURL + "api/manage/distribution/adminIntegral",
      adminIntegralUrl:  "api/management/adminIntegral",
      //积分详情
      adminIntegralDetail: BASEURL +  "api/manage/distribution/adminIntegralDetail",
      adminIntegralDetailUrl:  "api/management/adminIntegralDetail",
      //所有猫号剩余积分
      getIntegralRemainAll: BASEURL +  "api/manage/distribution/getIntegralRemainAll",
      getIntegralRemainAllUrl:  "api/management/userDistribution/getIntegralRemainAll",
      //获取当前下级贡献统计-请求时地址+first,second,third
      getStatisticalIntegralByNumber: BASEURL +  "api/manage/distribution/getStatisticalIntegral/",
      getStatisticalIntegralByNumberUrl:  "api/management/userDistributions/getStatisticalIntegral/",
      // 亲友网络,根据猫号或者手机号获取下级用户树状图
      getRelativesDetailsByRedId: BASEURL +  "api/manage/distribution/getRelativesDetailsByRedId",
      getRelativesDetailsByRedIdUrl:  "api/management/userDistributions/getRelativesDetailsByRedId",
  }
}
