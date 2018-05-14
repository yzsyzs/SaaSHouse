<!--
  导出组件
 -->
<template>
<el-form
  :inline="true"
  method='POST'
  action=''
>
  <el-input
    class="hidden"
    v-if='formItem.length > 0'
    v-for='(item, index) in formItem'
    :key='index'
    :name='item.key'
    :value='item.value'
  />
  <el-input class="hidden" name='token' :value='token' />
  <slot></slot>
</el-form>
</template>

<script>
export default {
    // 组件的名称
    name: 'exportForm',
    // props 可以是数组或对象，用于接收来自父组件的数据
    props: {},
    // 数据绑定
    data() {
        return {
          formItem: [],
          token: localStorage.getItem('accessToken')
        }
    },

    // 组件
    components: {},
    // 方法
    methods: {
      // 刷新函数, 根据父组件的搜索条件来更新这边的条件
      refresh(newFormItem) {
        let self = this
        self.formItem = newFormItem
      }
    },

    // 计算属性
    computed: {},

    // 常用钩子函数，总共有8个，可以参照vue的生命周期看

    // 完成了 data 数据的初始化，el没有，就是说页面的dom没有完成转化，还是 {{data}} 这种
    created() {},

    // 完成挂载，相当于dom ready
    mounted() {},

    // 销毁，可以做一些定时器的消费等操作
    destored() {},
}
</script>

<style scoped>

</style>
