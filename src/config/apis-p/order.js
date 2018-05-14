/**
 * Created by haoxb on 2017/11/19.
 */
export default(BASEURL) => {
  return {
    // 订单详情
    orderDetail: BASEURL + 'api/manage/order/orderDetail',/*todo 接口4000，未调，按照生活馆旧接口走的*/
    // 订单导出
    orderListExport: BASEURL + 'api/manage/order/orderListExport',
    // 消费记录
    getCourseConsumeList: BASEURL + 'api/manage/order/getCourseConsumeList',
    // 核销核销记录导出（消费记录）
    courseConsumeListExport: BASEURL + 'api/manage/order/courseConsumeListExport',
    // 订单列表
    orderList: BASEURL + 'api/manage/order/orderList',
    // 修改推荐导师
    updateSale: BASEURL + 'api/manage/order/updateSale'
  }
}
