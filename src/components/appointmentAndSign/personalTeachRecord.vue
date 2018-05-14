<!--/*
 * @Author: linc
 * @Date:   2017-12-8 12:38:47
 * @Last Modified by:   lincl
 * @Last Modified time: 2017-12-8 12:38:44
 */-->
<template>
	<el-main>
		<section class="signRecord_main">
			<template>
				<el-row>
					<el-row>
						<el-col :span="24" style="border-bottom:1px solid #eee ; padding-bottom: 10px;">
							<div>
								场馆:
								<el-select @change="getCourseNameList" filterable class="w300" v-model="params.lifeId" placeholder="请选择">
									<el-option v-for="(t, index) in houseList" :key="index" :label="t.lifeName" :value="t.lifeId"></el-option>
								</el-select>
								课程:
								<el-select @change="setDuration" filterable :disabled="!params.lifeId" class="w300" v-model="params.courseId" placeholder="请选择">
									<el-option v-for="(t, index) in courseList" :key="index" :label="t.courseName" :value="t.courseId"></el-option>
								</el-select>
							</div>
						</el-col>

					</el-row>
					<el-row v-if="params.lifeId&&params.courseId?true:false">
						<!--v-if="params.isVisible"-->
						<el-row :key="index" v-for="(item,index) in resultList" style="border-bottom:1px solid #eee ; padding-bottom: 10px;">
							<el-col :span="24" class="text-left" style="padding: 20px 0;">
								用户:
								<el-input :disabled="item.select" style="width:200px;padding-right: 20px;" v-model="item.mallIdOrPhone" placeholder="输入手机号、猫号"></el-input>
								<el-button v-if="!item.select" type="primary" round @click="onQuery(item.mallIdOrPhone,index)">查询</el-button>
							</el-col>
							<el-col :span="24" v-if="item.result.length>0">
								<h4 style="display: inline-block;padding: 10px 0;">课程信息</h4>
								<!--<table border="1" bordercolor="#ccc" cellspacing="0" cellpadding="1">
									<thead>
										<tr>
											<th>序号</th>
											<th>课程来源</th>
											<th>课程名称</th>
											<th>授课教练</th>
											<th>剩余节数</th>
											<th>过期时间</th>
											<th>操作</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(t, i) in item.result" :key="i">
											<td style="text-align: left;padding-left:5px!important;">
												{{i+1}}
											</td>
											<td>{{t.courseOrigin=="PRIVILEGECARD"?t.privilegeCardName:"购买课程"}}</td>
											<td>{{t.courseName}}</td>
											<td>{{t.coachName}}</td>
											<td>{{t.remain}}</td>
											<td>{{t.expireTime}}</td>
											<td>
												<span v-if="!t.select" @click="addToNowCourse(t,item.result,index)" class="el-icon-plus">消耗此课时</span>
												<span v-if="t.select" style="color: #000;">已选择此课程</span>
											</td>
										</tr>
									</tbody>
								</table>-->
								<el-table :data="item.result" style="width: 100%" :border="true">
									<el-table-column type="index" label="序号" width="180">
									</el-table-column>
									<el-table-column prop="courseOrigin" label="课程来源" width="180">
										<template slot-scope="scope">
											{{scope.row.courseOrigin=="PRIVILEGECARD"?scope.row.privilegeCardName:"购买课程"}}
										</template>
									</el-table-column>
									<el-table-column prop="courseName" label="课程名称" width="180">
									</el-table-column>
									<el-table-column prop="coachName" label="授课教练">
									</el-table-column>
									<el-table-column prop="expireTime" label="过期时间">
									</el-table-column>
									<el-table-column prop="remain" label="剩余次数">
									</el-table-column>
									<el-table-column prop="courseId" label="操作">
										<template slot-scope="scope">
											<span v-if="!scope.row.select" @click="addToNowCourse(scope.row,item.result,index)" class="el-icon-plus">消耗此课时</span>
											<span v-if="scope.row.select" style="color: #000;">已选择此课程</span>
										</template>
									</el-table-column>
								</el-table>
							</el-col>

						</el-row>
						<el-row v-if="beforSelect">
							<span class="addMore" @click="addMore">
							<i class="el-icon-plus" style="font-size: 40px;line-height: 80px;"></i>
							<br />
							<i style="font-size: 12px;font-style: normal;">添加更多预约用户</i>
						</span>
						</el-row>
						<el-row style="margin-top: 20px;">
							已添加预约人：
							<el-tag style="margin-left: 15px;" @close="delNowCourse(item)" v-for="(item,index) in yetAddMens" :key="index" closable :type="item.mallId">
								{{item.userName}}
							</el-tag>
						</el-row>
						<el-row>
							<el-col :span="24">
								<h4 style="padding: 20px 0;">预约上课时间</h4>
								<el-date-picker :editable="false"  v-model="time" @change="setTime" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :picker-options="pickerOptions2" placeholder="选择日期">
								</el-date-picker>
								<el-time-select :editable="false" :disabled="!time"  v-model="startTime" @change='setStartTime' :picker-options="lifeTime" placeholder="选择开始时间">
								</el-time-select>
								<span>结束时间：{{endTime}}</span>
							</el-col>
							<el-col :span="24" style="padding: 20px 0;">
								<el-button type="default" round @click="$router.go(-1)">取 消</el-button>
								<el-button type="success" round @click="onSave">确 认</el-button>
							</el-col>
						</el-row>
					</el-row>
				</el-row>
			</template>

		</section>
	</el-main>
</template>

<script>
	import { restful } from '@/servers/server'
	import { api } from '@/config/api'
	import { responeCode } from '@/config/config'
	import moment from 'moment'
	export default {
		name: 'personalTeachRecord',
		data() {
			return {
				isLoading: false,
				isPlus: false,
				time: '',
				//当前课程时长
				duration: 60,
				pickerOptions2: {
					disabledDate(time) {
						return time.getTime() < (Date.now() - 24 * 60 * 60 * 1000)
					}
				},
				params: {
					lifeId: '',
					courseId: ''
				},
				startTime: '',
				endTime: '',
				houseList: [],
				courseList: [],
				//当前查询的客户信息
				resultList: [{
					mallIdOrPhone: '',
					select: false,
					result: []
				}],
				//已预约的课程信息
				yetAddMens: [],
				//上一个是否已经选择
				beforSelect: false,
				lifeTime: {
					start: '08:30',
					step: '00:10',
					end: '18:30'
				},
				//用来对比营业时间的字段
				oldEndTime:'',
				oldstartTime:''
			}
		},
		methods: {
			//重置当前结果
			reset() {
				this.resultList = [{
					mallIdOrPhone: '',
					select: false,
					result: []
				}]
				this.beforSelect = false
				this.yetAddMens = []
				this.startTime = ''
				this.endTime = ''
			},
			setTime(val) {
				let self = this
				self.startTime = ''
				self.endTime = ''
				self.setStartTimeForSelect(val)
			},
			//计算当前可预约结束时间
			setEndTime(dis){				
				let self = this
				dis = dis||10 
				let lengthTen =  parseInt(self.duration/dis)	
				console.log(length)
				let hour = Number(self.oldEndTime.split(":")[0]),
				     min = Number(self.oldEndTime.split(":")[1])				    
				if(min>=lengthTen*dis){
					self.lifeTime.end = hour + ':' + (min-lengthTen*dis)
				}else{					
					self.lifeTime.end = (hour-1) + ":" + (min+60-lengthTen*dis)
				}
				console.log(self.lifeTime.end)
			},
			//若为当天则计算开始时间
			setStartTimeForSelect(startTime,dis){		
				let self = this
				let now = moment(new Date).format("YYYY-MM-DD")
				console.log(startTime+" ____ "+now)
				if(startTime!==now){
					self.lifeTime.start = self.oldstartTime
					return
				}
				let hour = new Date().getHours()
				let min = new Date().getMinutes()
				self.lifeTime.start = min>50?((hour + 1)>9?hour + 1:"0"+(hour + 1))+":00":(hour>9?hour:"0"+hour)+":"+parseInt(min/10)+"0"
				console.log(self.lifeTime.start)
			},
			//获取当前课程时长
			setDuration() {
				let self = this
				self.time = ''
				self.courseList.forEach((item) => {
					if(item.courseId == self.params.courseId) {
						self.duration = item.duration
						self.setEndTime()					
					}
				})
				self.reset();
			},
			//添加更多课时
			addMore() {
				let obj = {
					mallIdOrPhone: '',
					select: false,
					result: []
				}
				this.resultList.push(obj)
				this.beforSelect = false
			},
			/**
			 * 需要删除的预约信息
			 * @course  {Object} 当前的课程信息
			 */
			delNowCourse(course) {
				let self = this
				let index = self.yetAddMens.indexOf(course)
				if(index > -1) {
					self.yetAddMens.splice(index, 1)
				} else {
					self.$message.error("您删除的预约不存在")
				}
				self.resultList.splice(course.index, 1)
			},
			//  确认保存
			onSave() {
				let self = this
				if(!self.yetAddMens || self.yetAddMens.length == 0) {
					self.$message.error("至少添加一个预约人")
					return
				}
				if(!self.startTime) {
					self.$message.error("请选择预约开始时间")
					return
				}
				let params = {
					"startTime": self.time + " " + self.startTime,
					"endTime": self.time + " " + self.endTime,
					"preorderdate": self.yetAddMens
				}
				let config = {
					//请求方式
					method: 'post',
					//请求地址
					url: api.preorderMulti,
					//请求体参数
					param: params
				}
				restful.sendMyData(config, self, (res) => {
					if(res.code == 2000) {
						self.$message.success("预约成功")
						self.$router.push({
							path: '/appointRecord',
						})
					} else {
						self.$message.error(res.msg)
					}
				})
			},
			// 取消保存
			onReset() {
				this.params.mallIdOrPhone = ''
			},
			/**
			 * 当前添加的客户和课程信息
			 * @course  {Object} 当前的课程信息
			 */
			addToNowCourse(course, parent, rootIndex) {
				let self = this
				//默认当前课程可以预约
				self.beforSelect = true
				parent.forEach((item) => {
					self.$set(item, "select", false)
				})
				console.log(parent)
				course.userId = self.resultList[rootIndex].userId
				course.userName = self.resultList[rootIndex].userName
				self.$set(course, "select", true)
				self.resultList[rootIndex].select = true
				course.index = rootIndex
				let isNew = true
				console.log(self.yetAddMens)
				self.yetAddMens.forEach((item) => {
					if(item.courseId == course.courseId && item.userId == course.userId) {
						item = course

						isNew = false
					}
				})
				console.log(isNew)
				if(isNew) {
					self.yetAddMens.push(course)
				}
			},
			/*
			 *  获取场馆列表
			 */
			getLifeHouse() {
				let self = this
				self.resetResult()
				let config = {
					//请求方式
					method: 'post',
					//请求地址
					url: api.getLifeNameList,
					//请求体参数
					param: {},
				}
				restful.sendMyData(config, self, (res) => {
					if(res.code == 2000) {
						self.houseList = res.data
					} else {
						self.$message.error(res.msg)
					}
				})
			},
			/**
			 * 获取场馆营业时间
			 * @lifeId  {String} 场馆Id
			 */
			getTimeForLifeHouse(lifeId) {
				let self = this
				let config = {
					//请求方式
					method: 'post',
					//请求地址
					url: api.getLifeHouseDetail,
					//请求体参数
					param: {
						lifeId: lifeId
					},
				}
				restful.sendMyData(config, self, (res) => {
					if(res.code == 2000) {
						self.lifeTime.start = res.data.openTime
						self.lifeTime.end = res.data.endTime
						//用来做对比的时间
						self.oldEndTime = res.data.endTime
						self.oldstartTime = res.data.openTime
					} else {
						self.$message.error(res.msg)
					}
				})
				
			},
			/**
			 * 获取私教课列表
			 * @lifeId  {String} 场馆Id
			 */
			getCourseNameList(lifeId) {
				let self = this
				self.getTimeForLifeHouse(lifeId)
				self.params.courseId = ''
				self.time = ''
				//切换课程时重置当前的所有属性
				self.reset()
				let config = {
					//请求方式
					method: 'post',
					//请求地址
					url: api.getCourseNameList,
					//请求体参数
					param: {
						lifeId: lifeId
					},
				}
				/**
				 * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
				 * @config  {Object} 请求的参数主体
				 * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
				 * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
				 */
				restful.sendMyData(config, self, (res) => {
					if(res.code == 2000) {
						self.courseList = res.data
					} else {
						self.$message.error(res.msg)
					}
				})
			},
			//重置当前的查询结果
			resetResult() {
				return
				this.nowCourseList = []
				this.nowUserList = []
				this.time = ''
			},
			// 查询
			onQuery(mallIdOrPhone, index) {
				console.log(index)
				let self = this
				let isQuery = true
				self.resultList.forEach((item, i) => {
					if(item.mallIdOrPhone == mallIdOrPhone && i != index) {
						isQuery = false
					}
				})
				if(!isQuery) {
					self.$message.error("此手机号或者猫号已经添加过了。请勿重复查询")
					return
				}
				let param = {
					courseId: self.params.courseId,
					lifeId: self.params.lifeId,
					mallIdOrPhone: mallIdOrPhone
				}
				//若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
				let config = {
					//请求方式
					method: 'post',
					//请求地址
					url: api.getPresonalCourseList,
					//请求体参数
					param: param,
				}
				console.log(self.resultList[index])
				restful.sendMyData(config, self, (res) => {
					if(res.code == 2000) {
						for(let key in res.data) {
							self.resultList[index][key] = res.data[key]
						}
						self.$set(self.resultList[index], "result", res.data.privilegeCardPersonalCourseList)
						console.log(self.resultList[index])
					} else {
						self.$message.error(res.msg)
					}

				})

			},
			/*
			 * 得到时间戳
			 */
			getTimestamp(time) {
				if(!this.time) {
					this.$message.error("请先选择日期")
					return false
				}
				let year = new Date(this.time).getFullYear(),
					month = new Date(this.time).getMonth() > 9 ? new Date(this.time).getMonth() : '0' + new Date(this.time).getMonth(),
					day = new Date(this.time).getMonth() > 9 ? new Date(this.time).getMonth() : '0' + new Date(this.time).getDate()
				if(!time) return false
				let ta = time.split(':'),
					h = ta[0],
					m = ta[1],
					rt = new Date(year + '-' + month + '-' + day).setHours(h, m)
				return rt
			},

			/*
			 * 设置课程
			 */
			setCourse(val) {
				let self = this
				self.duration = ''
				self.curriculumNameArr.forEach((item, index) => {
					if(item.courseId === val) self.duration = item.duration
				})
				// 计算结束时间
				if(self.startTime) this.calTime(this.getTimestamp(self.startTime))
			},

			/*
			 * 设置开始时间
			 */
			setStartTime(val) {
				if (!val) return				
				// 计算结束时间
				if(this.duration) this.calTime(this.getTimestamp(val))
			},

			/*
			 * 计算结束时间
			 */
			calTime(st) {
				let self = this,
					t = new Date(st).getTime() + self.duration * 60 * 1000
				self.endTime = moment(t).format("YYYY-MM-DD HH:mm").split(' ')[1]
				

			},

		},
		created() {
			this.getLifeHouse()
		}

	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
	.signRecord_main {
		padding: 30px 20px;
		text-align: left;
		background: #FFFFFF;
		box-shadow: 0 2px 4px 0 #E9F0F0;
		.plus_more {
			width: 100px;
			height: 100px;
			border: 1px solid #ccc;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-params: center;
			margin: 10px 0;
			i {
				padding: 20px;
			}
			span {
				font-size: 10px;
			}
		}
	}
	
	.text-right {
		text-align: right;
	}
	
	.addMore {
		margin-top: 20px;
		display: inline-block;
		width: 120px;
		height: 120px;
		text-align: center;
		border: 1px solid #ccc;
		border-radius: 5px;
		background: #eee;
		cursor: pointer;
	}
	
	.addMore span {
		width: 80px;
		text-align: center;
	}
	
	table {
		width: 100%;
		font-size: .5rem;
		th {
			padding: 10px 5px;
			border: 1px solid #ccc;
		}
		tr {
			td {
				border: 1px solid #ccc;
				padding: 10px 5px;
				span {
					color: #28A3E6;
					&:hover {
						color: #f00;
						cursor: pointer;
					}
				}
			}
		}
	}
</style>