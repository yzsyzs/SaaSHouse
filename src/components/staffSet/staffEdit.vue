<!--/*
 * @Author: lincl
 * @Date:   2017-11-25 12:05:12
 * @Last Modified by:   lincl
 * @Last Modified time: 2017-11-25 12:05:15
 */-->
<!--员工配置-修改-->
<template>
	<staffAdd :isEdit="true"></staffAdd>
</template>

<script>
	import staffAdd from '@/components/staffSet/staffAdd.vue'
	export default {
		// 组件的名称
		components:{staffAdd},
		name: 'staffEdit',
		// props 可以是数组或对象，用于接收来自父组件的数据
		props: {},
		// 数据绑定
		data() {
			return {}
		},
	}
</script>

<style scoped>

</style>
