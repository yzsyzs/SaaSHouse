<template>
  <el-main>
    <el-tabs v-model="activeName" @tab-click="handleClick" style="background: #fff;padding: 20px 20px;">
      <el-tab-pane label="分销设置" v-if="checkPermission('api/manage/distribution/setConfigFromJoinAndQualificationAndRatio')" name="first"> <SetUp/> </el-tab-pane>
      <el-tab-pane label="亲友网络" v-if="checkPermission('api/manage/distribution/getRelativesAll')" name="second"> <Relatives/> </el-tab-pane>
    </el-tabs>
  </el-main>
</template>

<script>
import Relatives from '@/components/MarketingManagement/distributionSystem/relatives'
import SetUp from '@/components/MarketingManagement/distributionSystem/setUp'
export default {
    // 组件的名称
    name: 'distributionSystem',
    // props 可以是数组或对象，用于接收来自父组件的数据
    props: {},
    // 数据绑定
    data() {
        return {
          // 当前的 tab
          activeName: 'first'
        }
    },
    // 组件
    components: {
      Relatives,
      SetUp
    },

    // 注意，不应该使用箭头函数来定义 methods函数 或者  computed函数 (例如 aDouble: () => this.a * 2)。
    // 理由是箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例，this.a 将是 undefined

    // 方法
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    },

    // 计算属性
    computed: {},

    // 监听
    watch: {

        // 监听路由变化
        '$route' (to, from) {}
    },

    // 常用钩子函数，总共有8个，可以参照vue的生命周期看

    // 完成了 data 数据的初始化，el没有，就是说页面的dom没有完成转化，还是 {{data}} 这种
    created() {
    	this.checkPermission = window.checkPermission
    },

    // 完成挂载，相当于dom ready
    mounted() {},

    // 销毁，可以做一些定时器的消费等操作
    destored() {},
}
</script>

<style scoped>
</style>
