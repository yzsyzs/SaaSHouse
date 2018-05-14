<!--教练&导师-列表-->
<template>
	<staffList
		:jumpRoute="jumpRoute"
		:roleStatus="false">
	</staffList>
</template>
<script>
	import staffList from '@/components/staffSet/staffList.vue'
	export default {
		components:{staffList},
		// 组件的名称
		name: 'trainerList',
		// props 可以是数组或对象，用于接收来自父组件的数据
		props: {},
		// 数据绑定
		data() {
			return {
				//定义跳转的路由
				jumpRoute: {
					//删除
					add: '/trainerList/add',
					//编辑
					edit: '/trainerList/edit/',
					//详情
					detail: '/trainerList/detail/',
				},

			}
		},
	}
</script>

<style scoped>

</style>
