<template>
<Pavilions :pavilions="pavilions" :isRequired="true">
</Pavilions>
</template>

<script>
import Pavilions from '@/components/base/pavilions'
let fileds = {
  address: null,
  adminId: null,
  adminName: null,
  areaCode: null,
  areaName: null,
  cityAreaCode: null,
  cityAreaName: null,
  endTime: null,
  houseArea: null,
  imageDetails: [],
  imgListId: null,
  imgListUrl: null,
  latitude: null,
  lifeId: null,
  lifeName: null,
  longitude: null,
  miaoId: null,
  openTime: null,
  phone: null,
  provinceAreaCode: null,
  provinceAreaName: null,
  sortNo: null,
  status: 2,
  totalCapital: null,
  type: null
}

export default {

  // 组件的名称
  name: 'addPavilions',

  // props 可以是数组或对象，用于接收来自父组件的数据
  props: {},

  // 数据绑定
  data() {
    return {
      /*
       * detailImgArr: 详情图片数组, 需要传递过去，不然页面set数组不会变化,
       * listImgArr: 列表图片数组，目前只能上传一张
       */
      pavilions: {
        ...fileds,
        ...{
          detailImgArr: [],
          listImgArr: [{}],
          images: [],
        }
      }
    }
  },

  created() {},

  // 组件
  components: {
    Pavilions
  },

  // 方法
  methods: {},
}
</script>

<style scoped>

</style>
