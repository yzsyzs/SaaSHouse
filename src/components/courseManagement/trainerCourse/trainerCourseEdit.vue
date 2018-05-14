<!--/*
 * @Author: lincl
 * @Date:   2017-11-25 12:05:12
 * @Last Modified by:   lincl
 * @Last Modified time: 2017-11-25 12:05:15
 */-->
<!--私教课-编辑-->
<template>
	<trainerCourseAdd
		:isEdit="true"
		:isGroup="false"
		>
	</trainerCourseAdd>
</template>
<script>
	import trainerCourseAdd from '@/components/courseManagement/trainerCourse/trainerCourseAdd.vue'
	export default {
		components:{trainerCourseAdd},
		// 组件的名称
		name: 'trainerCourseEdit',
		// props 可以是数组或对象，用于接收来自父组件的数据
		props: {},
		// 数据绑定
		data() {
			return{}
		},
	}
</script>

<style  scoped>

</style>
