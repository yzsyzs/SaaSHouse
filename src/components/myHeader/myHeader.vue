<template>
  <el-header>
    <Breadcrumb/>
    <div class="myHeader_head_info">
      <i class="myHeader_head_info_headimg">
        <img v-if="!!userInfo.headImgUrl" :src="userInfo.headImgUrl"/>
        <img v-if="!userInfo.headImgUrl&&userInfo.sex!=0" src="../../assets/images/head_img.png"/>
      	<img v-if="!userInfo.headImgUrl&&userInfo.sex==0" src="../../assets/images/head_img_girl.png" />
      </i>
      <span class="el-dropdown-link myHeader_info_username">
          {{userInfo.mallName}}
      </span>
      <a style="font-size: 20px;padding-left: 15px;text-decoration: none;" @click="removeSession" class="logout">注销</a>
    </div>
  </el-header>
</template>

<script>
  import Breadcrumb from '@/components/base/breadcrumb'
  export default {

    // 组件的名称
    name: 'myHeader',

    // props 可以是数组或对象，用于接收来自父组件的数据
    props: {},

    // 数据绑定
    data() {
        return {
        	userInfo: {}
        }
    },
    components: {
      Breadcrumb
    },

    created() {
      this.userInfo = localStorage.loginData && JSON.parse(localStorage.loginData) || {
        headImgUrl: '',
        mallName: ''
      }
    },

    methods: {
      removeSession () {
      	this.$confirm('是否退出', '退出登录', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: false
				}).then(() => {
					localStorage.removeItem('accessToken')
       	 	localStorage.removeItem('loginData')
        	this.$router.push({path: '/login'})
				}).catch(() => {
					/*this.$message({
						type: 'info',
						message: '已取消删除'
					})*/
				});       
      },
      refresh() {
        this.userInfo = localStorage.loginData && JSON.parse(localStorage.loginData) || {
          headImgUrl: '',
          mallName: ''
        }
      }
    }

  }

</script>

<style>
/*头部用户信息*/
.myHeader_head_info {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 72px;
  padding: 0 40px;
  height: 72px;
}
/*头部头像*/
.myHeader_head_info_headimg {
  height: 30px;
  width: 30px;
  border: 1px solid #fff;
  overflow: hidden;
  border-radius: 100%;
  float: left;
  margin-top: 21px;
  position: relative;
}
/*头像*/

.myHeader_head_info_headimg img {
  height: 30px;
  width: 30px;
  position: absolute;
  top: 0;
  left: 0;
}
/*昵称*/
.myHeader_info_username {
  padding-left: 10px;
}
.myHeader_aside_head {
  width: 200px;
  height: 72px;
  position: absolute;
  top: 0;
  left: 0;
  background: #1B1F1E;
}
  .myHeader_info_username:hover {
    cursor: pointer;
  }

</style>
