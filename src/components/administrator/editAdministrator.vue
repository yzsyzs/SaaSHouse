<template>
<Aministrator ref='aministratorEl'></Aministrator>
</template>

<script>
import Aministrator from '@/components/administrator/administrator'
import { responeCode } from '@/config/config'
import { api } from '@/config/api'
import axios from 'axios'
export default {

  // 组件的名称
  name: 'editAministrator',

  // props 可以是数组或对象，用于接收来自父组件的数据
  props: {},

  // 数据绑定
  data() {
    return {}
  },

  created() {
    let self = this, id = self.$route.params.id
    // console.log('editAministrator created self.$route.params ', self.$route.params)
    self.sendReq(api.getAdminInfoDetail, {data: {id: id}}, (res) => {
      if(res.allowStatus) res.allowStatus = parseInt(res.allowStatus)
      if(res.sex) res.sex = parseInt(res.sex)
      if(res.sortNo) res.sortNo = parseInt(res.sortNo)
      self.$refs['aministratorEl'].refresh(res)
    })
  },

  // 组件
  components: {
    Aministrator
  },

  // 方法
  methods: {
    sendReq(url, params, callback) {
      let self = this;
      axios({
        method: params.method || 'POST',
        url: url,
        data: params.data || {}
      }).then((res) => {
        self.loading = false
        if (res && res.data && res.data.code === responeCode.OK) {
          if (res.data.page_info) self.page_info = res.data.page_info
          callback && callback(res.data.data);
        } else {
          self.$message.error('失败提示: ' + (res.data && res.data.msg || '返回数据异常'))
          console.log("editAministrator sendReq res ", res)
        }
      }, (error) => {
        self.loading = false
        self.$message.error('出现错误 ' + error)
        console.warn("editAministrator sendReq error ", error)
      })
    }
  },
}
</script>

<style  scoped>

</style>
