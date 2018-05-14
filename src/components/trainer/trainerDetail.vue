<!--教练&导师-详情-->
<template>
	<staffDetail :isCoach="true" ></staffDetail>
</template>
<script>
	import staffDetail from '@/components/staffSet/staffDetail.vue'
	export default {
		components:{staffDetail},
		// 组件的名称
		name: 'trainerDetail',
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
