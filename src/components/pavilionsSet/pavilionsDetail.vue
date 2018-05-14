<template>
<Pavilions :pavilions="pavilions" :isRequired="isRequired" :isDetail="isDetail" ref='pavilionsComponent'>
</Pavilions>
</template>

<script>
import { api } from '@/config/api'
import axios from 'axios'
import { responeCode } from '@/config/config'
import Pavilions from '@/components/base/pavilions'
let fileds = {
  "address": null,
  "adminId": null,
  "adminName": null,
  "areaCode": null,
  "areaName": null,
  "cityAreaCode": null,
  "cityAreaName": null,
  "endTime": null,
  "houseArea": null,
  "imageDetails": [{ "imgDetailId": null, "imgDetailUrl": null }],
  "imgListId": null,
  "imgListUrl": null,
  "latitude": null,
  "lifeId": null,
  "lifeName": null,
  "longitude": null,
  "miaoId": null,
  "openTime": null,
  "phone": null,
  "provinceAreaCode": null,
  "provinceAreaName": null,
  "sortNo": null,
  "status": 2,
  "totalCapital": null,
  "type": null
}
export default {

  // 组件的名称
  name: 'pavilionsDetail',

  // props 可以是数组或对象，用于接收来自父组件的数据
  props: {},

  // 数据绑定
  data() {
    return {
      isRequired: false,
      isDetail: true,
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

  created() {
    this.getPavilions()
  },

  // 组件
  components: {
    Pavilions
  },

  // 方法
  methods: {
    getPavilions() {
      let self = this,
          url = api.getLifeHouseDetail,
          params = {
            lifeId: this.$route.params.id
          }
      axios({
        method: 'POST',
        url: url,
        data: params
      }).then((res) => {
        if(res.data && res.data.code === responeCode.OK) {
          fileds = res.data.data
          self.pavilions = {
            ...fileds,
            ...{
              detailImgArr: [],
              listImgArr: [{}],
              images: [],
            }
          }
          this.$refs['pavilionsComponent'].refresh(self.pavilions)
          // console.log('pavilionsDetail methods getPavilions resolve self.pavilions ', self.pavilions)
        } else {
          self.$message.error((res.data && res.data.msg) || '获取馆详情失败')
        }
      }, (error) => {
        self.$message.error('获取馆详情失败')
        console.warn("pavilionsDetail methods getPavilions reject error ", error)
      })
    }
  },

  watch: {
    pavilions(newVal, oldVal) {
      // console.log(newVal, oldVal)
    }
  }
}
</script>

<style>

</style>
