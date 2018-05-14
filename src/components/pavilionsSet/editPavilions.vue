<!--
  编辑场馆组件
  @作者: chanwefun
-->
<template>
  <Pavilions :pavilions="pavilions" :isRequired="isRequired" ref='pavilionsComponent'>
  
  </Pavilions>
</template>

<script>
  import Pavilions from '@/components/base/pavilions'
  
  import {
  
    api
  
  } from '@/config/api'
  
  import axios from 'axios'
  
  import {
  
    responeCode
  
  } from '@/config/config'
  
  let fileds = {
  
    address: null,
  
    adminId: '',
  
    adminName: null,
  
    areaCode: null,
  
    areaName: null,
  
    cityAreaCode: null,
  
    cityAreaName: null,
  
    endTime: null,
  
    houseArea: null,
  
    imageDetails: [{
  
      "imgDetailId": null,
  
      "imgDetailUrl": null
  
    }],
  
    imgListId: null,
  
    imgListUrl: null,
  
    location: null,
  
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
  
    name: 'editPavilions',
  
  
  
    // props 可以是数组或对象，用于接收来自父组件的数据
  
    props: {},
  
  
  
    // 数据绑定
  
    data() {
  
      return {
  
        isRequired: true,
  
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
  
  
    mounted() {
  
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
  
            lifeId: self.$route.params.id
  
          }
  
        axios({
  
          method: 'POST',
  
          url: url,
  
          data: params
  
        }).then((res) => {
  
          if (res.data && res.data.code === responeCode.OK) {
  
            fileds = res.data.data
  
            self.pavilions = {
  
              ...fileds,
  
              ...{
  
                detailImgArr: [],
  
                listImgArr: [{}],
  
                images: [],
  
              }
  
            }
  
            // 转化格式处理
  
            if (self.pavilions.lifeNo && self.pavilions.lifeNo.length > 0) self.pavilions.lifeNo = parseInt(self.pavilions.lifeNo)
  
            if (self.pavilions.houseArea && self.pavilions.houseArea.length > 0) self.pavilions.houseArea = parseInt(self.pavilions.houseArea)
  
            if (self.pavilions.sortNo && self.pavilions.sortNo.length > 0) self.pavilions.sortNo = parseInt(self.pavilions.sortNo)
  
            if (self.pavilions.totalCapital && self.pavilions.totalCapital.length > 0) self.pavilions.totalCapital = parseInt(self.pavilions.totalCapital)
  
            if (self.pavilions.status && self.pavilions.status.length > 0) self.pavilions.status = parseInt(self.pavilions.status)
  
  
  
            this.$refs['pavilionsComponent'].refresh(self.pavilions)
  
          } else {
  
            self.$message.error((res.data && res.data.msg) || '获取馆数据失败')
  
          }
  
        }, (error) => {
  
          self.$message.error('获取馆数据失败')
  
          console.warn("pavilionsDetail methods getPavilions reject error ", error)
  
        })
  
      }
  
    },
  
  }
</script>

<style scoped>
  
</style>
