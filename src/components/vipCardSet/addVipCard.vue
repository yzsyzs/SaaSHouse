<template>
  <VipCard :vipCard="vipCard"></VipCard>
</template>

<script>
  import VipCard from '@/components/base/vipCard'
  import axios from 'axios'
  import { responeCode } from '@/config/config'
  import { api } from '@/config/api'
  export default {

    // 组件的名称
    name: 'addVipCard',

    // props 可以是数组或对象，用于接收来自父组件的数据
    props: {},

    // 数据绑定
    data() {
      return {
        // TODO
        vipCard: {
          cardName: null,
          cardType: null,
          suitableHouseIds: [],
          groupClassCount: null,
          privateClassCount: null,
          originalPrice: null,
          sellPrice: null,
          validPeriod: null,
          selectCanBookGroupClassIdArr: [],
          selectCanBookPrivateClassIdArr: [],
          vipValidatePeriod: null,
          displaySort: null,
          vipCanBuyCount: null,
          vipValidatePeriodType: null,
          cardBackground: null
        }
      }
    },

    // 组件
    components: {
      VipCard
    },

    // 方法
    methods: {},

    // 完成了 data 数据的初始化，el没有，就是说页面的dom没有完成转化，还是 {{data}} 这种
    created(){},

    // 完成挂载，相当于dom ready
    mounted(){},
  }

</script>

<style scoped>

</style>
