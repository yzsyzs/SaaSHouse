/*
 * 列表搜索的 mixin
 */
import axios from 'axios'
import { api } from '@/config/api'
import { responeCode } from '@/config/config'
import { getExportFormComItem } from '@/common/tools'

export const listSearch = {
  data() {
    return {
      // 加载中
      loading: false,
      // 页面的列表数据
      listData: []
    }
  },
  methods: {

    /*
     * 处理页面序号的变化
     */
    indexMethod(index) {
      if(this.page === 1 || this.page === 0) return index + 1
      return ((this.page - 1) * this.count) + index + 1
    },

    /*
     * 搜索函数
     */
    search() {
      let self = this, params = self.getParams()
      if(!params) return false
      self.loading = true
      self.sendReq(params, (res) => {
        self.listData = res || []
      })

      // self.elForm 为导出组件的引用，如果有用到，需要在组件的mounted中定义如： self.elForm = self.$refs['elForm']
      // 调用导出插件的刷新函数
      // getExportFormComItem 的参数为【页面搜索的条件】，为 {} 类型
      self.elForm && self.elForm.refresh(getExportFormComItem(params.data))
    },

    /*
     * 改变页面显示的条数
     */
    handleSizeChange(count) {
      this.count = count
      this.search()
    },

    /*
     * 改变页码
     */
    handleCurrentChange(page) {
      this.page = page
      this.search()
    },

    /*
     * 获取参数，这个方法必须在组件中去覆盖，不然应该提示错误
     * 可以理解为后台的抽象函数
     */
    getParams() {
      let self = this
      self.$message.error('请在组件的methods中定义获取参数的方法 [ getParams ]')
      return false
    },

    /*
     * 发送请求
     */
    sendReq(params, callback) {
      let self = this
      axios({
        method: params.method || 'POST',
        url: params.url,
        data: params.data || {}
      }).then((res) => {
        self.loading = false
        if (res && res.data && res.data.code === responeCode.OK) {
          if (res.data.page_info) self.page_info = res.data.page_info
          callback && callback(res.data.data)
        } else {
          self.$message.error('失败提示: ' + (res.data && res.data.msg || '返回数据异常'))
          console.log("sendReq res ", res)
        }
      }, (error) => {
        self.loading = false
        self.$message.error('出现错误 ' + error)
        console.warn("sendReq error ", error)
      })
    },
  }
}
