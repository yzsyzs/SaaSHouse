<!--教练&导师-新增-->
<template>
	<staffAdd :isCoach="true"></staffAdd>
</template>
<script>
	import staffAdd from '@/components/staffSet/staffAdd.vue'
	export default {
		components:{staffAdd},
		// 组件的名称
		name: 'trainerAdd',
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
