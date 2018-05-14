<template>
<div id="app">
  <el-container>
    <!-- 侧边栏 -->
    <sidebar v-show='isLogined' ref="sidebar"></sidebar>
    <el-container>
      <!-- 头部 -->
      <my-header v-show='isLogined' ref='myHeader'></my-header>
      <!-- 主区域 -->
      <router-view @validateLogin='validateLogin'/>
    </el-container>
  </el-container>
</div>
</template>

<script>
import MyHeader from '@/components/myHeader/myHeader'
import Sidebar from '@/components/sidebar/sidebar'
export default {
  name: 'app',
  data() {
    return {
      isLogined: false
    }
  },
  components: {
    MyHeader,
    Sidebar,
  },
  created() {
    let self = this
    if(localStorage.getItem('accessToken')) {
      self.isLogined = true
    } else {
      self.$router.push({ path: '/dashboard'})
    }
  },
  methods: {
    validateLogin(val) {
      let self = this
      self.isLogined = val
      self.$refs['myHeader'] && self.$refs['myHeader'].refresh()
      self.$refs['sidebar'] && self.$refs['sidebar'].refresh()
    }
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  /*margin-top: 60px;*/
 	background: #F5F8F8;
}
</style>
