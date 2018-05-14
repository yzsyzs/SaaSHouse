<!--/*
 * @Author: lincl
 * @Date:   2017-11-25 12:05:12
 * @Last Modified by:   lincl
 * @Last Modified time: 2017-11-25 12:05:15
 */-->
<!--团课-详情-->
<template>
	<trainerCourseDetail
		:isGroup="true"
		:isEdit="true"
		>
	</trainerCourseDetail>
</template>
<script>
	import trainerCourseDetail from '@/components/courseManagement/trainerCourse/trainerCourseDetail.vue'
	export default {
		components:{trainerCourseDetail},
		// 组件的名称
		name: 'groupCourseDetail',
		// props 可以是数组或对象，用于接收来自父组件的数据
		props: {},
		// 数据绑定
		data() {
			return{}
		},
	}
</script>

<style scoped>

</style>
