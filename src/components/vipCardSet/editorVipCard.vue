<template>
  <VipCard :vipCard="vipCard" :isEdit='true' ref='vipCardEl'></VipCard>
</template>

<script>
  import VipCard from '@/components/base/vipCard'
  import axios from 'axios'
  import { responeCode } from '@/config/config'
  import { api } from '@/config/api'
  let fileds = {
    // 特权卡类型, 默认选择期限卡
    cardType: '',
    // 如果是引用类型的话这里需要做初始化
    // 团课id
    groupCourseIds: [],
    // 私教课id
    personalCourseIds: [],
    // 自动激活时间
    autoActivateTime: '',
    // 激活类型
    activateType: '',
    // 允许最多购买
    allowBuyCount: '',
    // 自动激活时间
    autoActivateTime: '',
    // 特权卡类型
    cardType: '',
    // 私教课购买节数
    personalCount: '',
    // 团课购买节数
    groupCount: '',
    // 特权卡id
    id: "",
    // 卡背景图片id
    imgId: "",
    // 卡背景图url
    imgUrl: "",
    // 生活馆id
    lifeId: "",
    // 特权卡名称
    name: "",
    // 原价
    originPrice: '',
    // 售价
    sellPrice: '',
    // 有效期
    validPeriod: '',
    // 简介
    remark: "",
    // 展示排序
    sortNo: ''
  }
  export default {

    // 组件的名称
    name: 'editorVipCard',

    // props 可以是数组或对象，用于接收来自父组件的数据
    props: {},

    // 数据绑定
    data() {
      return {
        vipCard: fileds
      }
    },

    // 组件
    components: {
      VipCard
    },

    // 方法
    methods: {
      getCardDetail() {
        let self = this,
            url = api.getCardDetail,
            params = {
              id: self.$route.params.id
            }
        axios({
          method: 'POST',
          url: url,
          data: params
        }).then((res) => {
          if(res.data && res.data.code === responeCode.OK) {
            let vipCardDetail = res.data.data
            if(vipCardDetail && vipCardDetail.cardType.length > 0) vipCardDetail.cardType = parseInt(vipCardDetail.cardType)
            self.$refs['vipCardEl'].refresh(vipCardDetail)
          } else {
            self.$message.error((res.data && res.data.msg) || '获取特权卡数据失败')
          }
          // console.log('editorVipCard methods getCardDetail resolve res ', res)
        }, (error) => {
          self.$message.error('获取特权卡数据失败')
        })
      }
    },
    // 完成了 data 数据的初始化，el没有，就是说页面的dom没有完成转化，还是 {{data}} 这种
    created(){
      let self = this
      self.getCardDetail()
    },

    // 完成挂载，相当于dom ready
    mounted(){},
  }

</script>

<style  scoped>

</style>
