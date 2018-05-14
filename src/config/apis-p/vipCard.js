export default (BASEURL) => {
  return {
    // 删除特权卡
    deleteCard: BASEURL + 'api/manage/privilegecard/deleteCard',
    // 查询特权卡详情
    getCardDetail: BASEURL + 'api/manage/privilegecard/getCardDetail',
    // 查询特权卡列表
    getCardList: BASEURL + 'api/manage/privilegecard/getCardList',
    // 保存特权卡信息
    saveCard: BASEURL + 'api/manage/privilegecard/saveCard',
    // 启用/停用特权卡
    updateCardStatus: BASEURL + 'api/manage/privilegecard/updateCardStatus',
    // 获取特权卡背景图片
    getCardImageList: BASEURL + 'api/manage/privilegecard/getCardImageList',
    // 删除特权卡背景图片
    deleteCardImage: BASEURL + 'api/manage/privilegecard/deleteCardImage',
    // 保存特权卡背景图片信息
    saveCardImages: BASEURL + 'api/manage/privilegecard/saveCardImages',
    // 获取生活馆下面的特权卡列表
    findCardByLife: BASEURL + 'api/manage/privilegecard/findCardByLife',
    // 选用户之特权卡列表
    getValidPrivilegeCardList: BASEURL + 'api/manage/privilegecard/getValidPrivilegeCardList',
  }
}
