<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <!-- 这里需要加多一个默认显示，不然的话由于路由加载的延迟会导致页面报错 -->
    <el-breadcrumb-item
      v-if='breadlist.length === 0'
      class="nomal-breadcrumb"
      :to="{ path: '/' }"
    >
      首页
    </el-breadcrumb-item>
    <el-breadcrumb-item
      v-else
      v-for="(item, index) in breadlist"
      :to="{path: item.path}"
      :key="item.path"
      :class="item.class"
    >
      {{item.name}}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  export default {

    // 组件的名称
    name: 'breadcrumb',

    // props 可以是数组或对象，用于接收来自父组件的数据
    props: {},

    // 数据绑定
    data() {
        return {
          breadlist: '' // 路由集合
        }
    },

    mounted() {
      this.getBreadcrumb()
    },

    // 方法
    methods: {
      getBreadcrumb () {
        let routeArr = this.$route.matched
        let otherR = [];
        this.breadlist = routeArr.map((item, index) => {
          // console.log('breadcrumb.vue getBreadcrumb item ', item.meta)
          let metaArr = item.meta;
          if(metaArr && metaArr.length > 0) {
            metaArr.map((item, indx) => {
              // TODO 有待扩展, 局限性大
              if(item.path.indexOf(':') > -1) {
                let r = item.path.split(":"),
                    query = this.$route.query,
                    params = this.$route.params
                item.path = r[0] + this.$route.params[Object.keys(params)[0]]
                let queryArr = Object.keys(query)
                if(queryArr && queryArr.length > 0) {
                  item.path += '?'
                  queryArr.forEach((i, index) => {
                      item.path += ((index !== 0 ? '&': '') + i + '=' + query[i])
                  })
                }
              }
              otherR.push({name: item.name, path: item.path, class: 'normal-breadcrumb'})
            })
          }
          if(item.path === "") item.path = "/"
          // 最后显示的面包屑需要高亮
          item.class = 'active-breadcrumb';
          return item
        });
        // 把起来路由添加到面包屑
        if(otherR && otherR.length > 0) {
          otherR.map((item, index) => {
            this.breadlist.unshift(item)
          })
        }
      }
    },
    watch: {
      // 监听路由变化
      $route() {
        this.getBreadcrumb();
      }
    }

  }

</script>

<style scoped>
.active-breadcrumb {
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #444A49;
}

.normal-breadcrumb {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #B9BEBD;
}

</style>
