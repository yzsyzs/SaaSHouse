<template>
  <span>
  
        <el-input
  
          size='medium'
  
          type="text"
  
          id="suggestId"
  
          name="address_detail"
  
          :disabled='isDetail'
  
          placeholder="请输入详细地址"
  
          v-model="address_detail"
  
          class="input_style"
  
          @blur="onBlur"
  
        />
  
        <div id="allmap"></div>
  
      </span>
</template>
<script>
  import {
  
    MP
  
  } from '@/common/map'
  
  import {
  
    BmapAk
  
  } from '@/config/config'
  
  export default {
  
    name: 'Bmap',
  
    props: {
  
      isDetail: {
  
        type: Boolean,
  
        default: false
  
      }
  
    },
  
    data() {
  
      return {
  
        // 详细地址

        address_detail: '', 
  
        userlocation: {
  
          lng: "",
  
          lat: ""
  
        },
  
      }
  
    },
  
    methods: {
  
      onBlur() {

        this.$emit('selectDetailAddress', this.address_detail, this.userlocation)
  
      },
  
      refresh(obj) {
  
        if (obj.location) {
          
          // TODO 延迟时间待评估

          let timer = setTimeout( () => {
            
            clearTimeout(timer)

            this.address_detail = obj.location

            // document.getElementById('suggestId').value = this.address_detail

          
          }, 600)
  
        }
  
      }
  
    },
  
    mounted() {
  
      this.$nextTick(function() {
  
        MP(BmapAk).then(BMap => {

          var th = this
  
          var map = new BMap.Map("allmap") // 创建Map实例
  
          var point = new BMap.Point(116.404, 39.915) // 创建点坐标
  
          map.centerAndZoom(point, 15)   
  
          map.enableScrollWheelZoom()
  
          // 建立一个自动完成的对象
  
          var ac = new BMap.Autocomplete({
  
            "input": "suggestId",
  
            "location": map
  
          })
  
          var myValue
  
  
  
          //鼠标点击下拉列表后的事件
  
          ac.addEventListener("onconfirm", function(e) {
  
            var _value = e.item.value
  
            myValue = _value.province + _value.city + _value.district + _value.street + _value.business

            th.address_detail = myValue
  
            th.$emit('selectDetailAddress', th.address_detail)
  
            th.setPlace()
  
          })
  
  
  
          th.setPlace = function() {

            debugger
  
            //清除地图上所有覆盖物
  
            map.clearOverlays()
  
            function myFun() {
  
              //获取第一个智能搜索的结果
  
              th.userlocation = local.getResults().getPoi(0).point
  
              map.centerAndZoom(th.userlocation, 18)
  
              //添加标注
  
              map.addOverlay(new BMap.Marker(th.userlocation))
  
              th.$emit('selectDetailH', th.userlocation)
  
              // 设置了自动失去焦点
  
              document.getElementById('suggestId').blur()
  
            }
  
            //智能搜索
  
            var local = new BMap.LocalSearch(map, {
  
              onSearchComplete: myFun
  
            })
  
            local.search(myValue)
  
          }
  
        })
  
      })
  
    }
  
  }
</script>
<style scoped>
  .tangram-suggestion .route-icon {
  
    /* background: url(http://webmap1.map.bdstatic.com/wolfman/static/common/images/ui3/tools/suggestion-icon_013979b.png) no-repeat 0 -12px!important */
  
  }
</style>
