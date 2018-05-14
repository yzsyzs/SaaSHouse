
export default (BASEURL) => {
  return {
    // 上传图片   
    multiFileUploadMany: BASEURL + "api/manage/multiFileUploadMany",
    //图片批量上传-新
    uploadImages: BASEURL + "api/manage/uploadImages",
    //视频上传-初始化获取乐视视频上传地址
    letvini: BASEURL + "api/manage/video/letvini",
  }
}
