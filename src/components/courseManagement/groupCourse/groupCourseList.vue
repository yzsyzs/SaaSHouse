<!--/*
 * @Author: lincl
 * @Date:   2017-11-25 12:05:12
 * @Last Modified by:   lincl
 * @Last Modified time: 2017-11-25 12:05:15
 */-->
<!--团课-配置团课-->
<template>
	<trainerCourseList :jumpRoute="jumpRoute" :isGroup="true" ></trainerCourseList>
</template>
<script>
	import trainerCourseList from '@/components/courseManagement/trainerCourse/trainerCourseList.vue'
	export default {
		components:{trainerCourseList},
		// 组件的名称
		name: 'groupCourseList',
		// props 可以是数组或对象，用于接收来自父组件的数据
		props: {
		},
		// 数据绑定
		data() {
			return {
				//定义跳转的路由
				jumpRoute: {
					//删除
					add: '/groupCourseList/add',
					//编辑
					edit: '/groupCourseList/edit/',
					//详情
					detail: '/groupCourseList/detail/',
				},
			}
		},
	}
</script>

<style scoped>

</style>
