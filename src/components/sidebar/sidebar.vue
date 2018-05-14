<template>
	<el-aside width="200px">
	
		<div class="sidebar_aside_head">
	
			<a>
	
				<img src="../../images/logo.png" />
	
			</a>
	
		</div>
	
		<div class="sidebar_aside_uirooter">
	
			<el-row class="tac">
	
				<el-col :span="12">
	
					<el-menu :default-active='activeRoutePath' class="el-menu-vertical-demo" width="200px" background-color="#212928" text-color="#A7A9A9" active-text-color="#ffffff" unique-opened router>
	
						<!-- <el-submenu v-bind:class="{ 'is-opened': checkRout(item.subNav)}" v-for="(item, index) in menu" :index="''+index" key="$index"> -->
	
						<el-submenu v-for="(item, index) in menu" :index="''+index" key="$index">
	
							<template slot="title">
	
									<i :class="item.icon"></i>
	
									<span>{{item.navName}}</span>
</template>
							<el-menu-item v-for="(subNavItem, subNavIndex) in item.subNav" :index="subNavItem.route" :key="subNavIndex">
								{{subNavItem.navName}}
							</el-menu-item>
						</el-submenu>
					</el-menu>
				</el-col>
			</el-row>
		</div>
	</el-aside>
</template>

<script>
	import {
	
		responeCode,
	
		publicKey
	
	} from '@/config/config'
	
	import {
	
		api
	
	} from '@/config/api'
	
	import axios from 'axios'
	
	import {
	
		restful
	
	} from '@/servers/server'
	
	
	
	import {
	
		showObjType
	
	} from '@/common/tools'
	
	
	
	export default {
	
		// 组件的名称
	
		name: 'sidebar',
	
		// props 可以是数组或对象，用于接收来自父组件的数据
	
		props: {},
	
		// 数据绑定
	
		data() {
	
			return {
	
				menu: [],
	
				isActive: false,
	
				nowRouter: '',
	
				activeRoutePath: ''
	
			}
	
		},
	
		created() {
	
			this.refresh()
	
			this.nowRouter = location.hash.split("#")[1]
	
			this.activeRoutePath = this.$route.path
	
		},
	
		mounted() {},
	
	
	
		watch: {
	
			// TODO 性能待评估
	
			'$route' (to, from) {
	
				if (showObjType(to.meta) === "Array") {
	
					this.activeRoutePath = to.meta[to.meta.length - 1].path && to.meta[to.meta.length - 1].path.split('?')[0]
	
				} else {
	
					this.activeRoutePath = this.$route.path
	
				}
	
			}
	
		},
	
	
	
		methods: {
	
			//判断当前的hash和那个路由对应
	
			checkRout(subNav) {
	
				let self = this;
	
				let isOpen = false;
	
				subNav.forEach((item) => {
	
					if (item.route == self.nowRouter) {
	
						isOpen = true;
	
					}
	
				})
	
				//TODO 暂时没用
	
				return isOpen;
	
			},
	
			//获取当前的侧边菜单和权限
	
			refresh() {
	
				let self = this
	
				self.menu = localStorage.loginData ? JSON.parse(localStorage.loginData).menus : []
	
				localStorage.permissions = localStorage.permissions || []
	
				let permissionsArr = localStorage.loginData ? JSON.parse(localStorage.getItem('loginData')).resources : []
	
			}
	
		}
	
	}
</script>

<style scoped>
	/*侧边栏导航*/
	
	
	
	.sidebar_aside_uirooter {
	
		margin-top: 72px;
	
		background: #212928;
	
	}
	
	
	
	.sidebar_aside_head a {
	
		width: 100%;
	
		height: 100%;
	
		display: block;
	
	}
	
	
	
	.sidebar_aside_head img {
	
		float: left;
	
		width: 120px;
	
		height: 38px;
	
		margin-left: 9px;
	
		margin-top: 18px;
	
	}
	
	
	
	.el-menu-item:hover {
	
		background: rgba(0, 185, 158, 0.4)!important;
	
	}
	
	
	
	.el-menu-item.is-active {
	
		background: rgba(0, 185, 158, 0.4)!important;
	
	}
</style>
