<!--薪资配置-->
<template>
	<el-main>
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="固定工资" name="first">
				<el-row>
					<el-col :span="24" style="text-align: right; padding-bottom: 20px;">
						<el-button @click="addBaseSalary()" type="primary" round icon="el-icon-add" size="medium">添加固定工资</el-button>
					</el-col>
					<el-col :span="24">
					</el-col>
					<el-col :span="24" class="">
						<el-collapse accordion v-for="(tab,index) in tabs" @change="changeClass(tab)" :key="index">
							<el-collapse-item >
								<template slot="title">
									<div class="salary_base">
										<span style="color: #000; padding-left: 20px; padding-right: 100px;">
											<i :class="tab.select?'el-icon-caret-right':'el-icon-caret-bottom'"></i>
											固定工资
										</span>
										<i>{{tab.name}}</i>
										<i class="el-icon-circle-close-outline salary_del"
											@click.stop ="delBaseSalary(tab.id)"></i>

									</div>
								</template>
								<div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>

							</el-collapse-item>
							<el-col :span="24" style="height:50px;background: #F5F8F8;">
							</el-col>
						</el-collapse>
					</el-col>
				</el-row>
			</el-tab-pane>
			<el-tab-pane label="销售提成" name="second">

			</el-tab-pane>
			<el-tab-pane label="私教课酬" name="third">

			</el-tab-pane>
			<el-tab-pane label="团课课酬" name="fourth">

			</el-tab-pane>
		</el-tabs>
	</el-main>
</template>

<script>
	export default {
		// 组件的名称
		name: 'salarySet',
		// props 可以是数组或对象，用于接收来自父组件的数据
		props: {},
		// 数据绑定
		data() {
			return {
				activeName: 'first',
				select:true,
				tabs:[{id:1,select:false,name:"私教底薪"},{id:1,select:false,name:"基础工资"}]
			}
		},
		methods: {
			handleClick(tab, event) {
				console.log(tab, event);
			},
			changeClass(item){
				item.select = !item.select;
			},
			delBaseSalary(id){
				alert(1)
			},
		}
	}
</script>

<style  scoped>
	.el-icon-arrow-right::before{
		content: ""!important;
	}
	.el-collapse-item__arrow{
		float: left !important;
	}
	.el-collapse-item{
		float: left!important;
		width: 100%;
	}
	i.salary_del{
		position: absolute;
		top: 10px;
		right: 0px;
		font-size: 25px;
		color: #f00;
		width: 40px;
		height: 40px;
	}
	.salary_base{
		text-align: left;
		border-bottom: 1px solid #ccc;
		position: relative;
	}
</style>
