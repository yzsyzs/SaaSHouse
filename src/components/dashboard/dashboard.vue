<template>
	<el-main>
		<HouseAreaLinkage
        ref="linkage"
        :showStoreTag='showStoreTag'
        @getProvince='getProvince'
        @getCity='getCity'
        @getArea='getArea'
        @getHouse='getHouse'
        @getStoreTag='getStoreTag'
    ></HouseAreaLinkage>
		<section class="txall">
			<el-button type="primary" icon="el-icon-search" size="medium">primary</el-button>
			<el-button type="success" icon="el-icon-search" size="medium">success</el-button>
			<el-button type="warning" icon="el-icon-search" size="medium">warning</el-button>
			<el-button type="danger" icon="el-icon-search" size="medium">danger</el-button>
			<el-button type="info" icon="el-icon-search" size="medium">info</el-button>
      <el-button type="primary" :loading="true" size="medium">加载中</el-button>
      <el-radio v-model="radio" label="1">备选项</el-radio>
      <el-radio v-model="radio" label="2">备选项</el-radio>
		</section>
	</el-main>
</template>

<script>
	import HouseAreaLinkage from '@/components/base/houseAreaLinkage'
	export default {
		name: 'dashboard',
		data() {
			return {
				msg: '',
				show: true,
				showStoreTag: true,
        province: null,
        city: null,
        area: null,
        house: null,
        tag: null,
        radio: '1'
			}
		},
		components: {
			HouseAreaLinkage
		},
		methods: {
    		clearSeleted() {
          var val = {
            province: null,
            city: null,
            area: null,
            house: null,
            tag: null
          };

          // TODO 后续有组件需要情况数据，按照这种方式
          this.$refs.linkage.setlinkageObj(val)
        },
        getProvince(val){
            this.province = val
        },
        getCity(val) {
            this.city = val
        },
        getArea(val) {
            this.area = val
        },
        getHouse(val) {
            this.house = val
        },
        getStoreTag(val) {
            this.tag = val
        }
		}
	}
</script>
<style scoped>
</style>
