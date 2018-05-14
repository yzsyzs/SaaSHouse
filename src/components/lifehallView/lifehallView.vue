<!--/*
 * @Author: yzs
 * @Date:   2017-11-29 11:05:12
 * @Last Modified by:   yzs
 * @Last Modified time: 2017-11-29 11:05:15
 */-->
<template>
	<el-main>

		<div class="houseAreaLinkage" style="min-width:900px;overflow: hidden;">

			<HouseAreaLinkage :isNeedLinkage="false" :isNotLifeView="false" ref='houseAreaLinkage' @getProvince='setProvince' @getCity='setCity' @getArea='setArea' @getHouse='setHouse' />

			<div class="row">

				<div class="houseAreaLinkage_select mgr4">

					选择日期 :

					<el-date-picker :editable="false" class="400" v-model="params.time" type="daterange" @change="isTimeChange" value-format="yyyy-MM-dd" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right"></el-date-picker>

				</div>

				<div class="houseAreaLinkage_select mgr4">

					<el-button type="primary" :loading="isLoading" round @click="onQuery">查询</el-button>

					<el-button round type="info" size="medium" @click.stop='reset'>重置</el-button>

				</div>

			</div>

			<el-row id="all_data" style="border: 1px solid #ccc;padding: 10px 0;font-size: 15px;">

				<el-col :span="4">

					<img src="../../assets/images/icon_zijin.png" style="width:20%;height:20%;padding: 0px 40px 14px 0px;" alt="">

					<div style="display: inline-block;padding: 20px 0;">

						<span>总资金投入(元)</span>

						<p>{{allChina.toltalCaptial?allChina.toltalCaptial:0}}</p>

					</div>

				</el-col>

				<el-col :span="4">

					<div>

						<span>当前时间段会员接待量</span>

						<p>{{allChina.memberCount?allChina.memberCount:0}}</p>

						<p>截止本日累计接待量 {{allChina.totalMemberCount?allChina.totalMemberCount:0}}</p>

					</div>

				</el-col>

				<el-col :span="4">

					<div>

						<span>当前时间段用水量</span>

						<p>{{allChina.warterQuantity?allChina.warterQuantity:0}}</p>

						<p>截止本日累计用水量 {{allChina.warterTotalQuantity?allChina.warterTotalQuantity:0}}</p>

					</div>

				</el-col>

				<el-col :span="4">

					<div>

						<span>当前时间段用电量</span>

						<p>{{allChina.electricityQuantity?allChina.electricityQuantity:0}}</p>

						<p>截止本日累计用电量 {{allChina.electricityToTalQuantity?allChina.electricityToTalQuantity:0}}</p>

					</div>

				</el-col>

				<el-col :span="4">

					<div style="display: inline-block;line-height: 2">

						<span>设备数量</span>

						<p>{{totalDevice?totalDevice:0}}</p>

					</div>

				</el-col>

				<el-col :span="4">

					<div style="display: inline-block;line-height: 2">

						<span>场馆总面积(平方米)</span>

						<p>{{allChina.totalArea?allChina.totalArea:0}}</p>

					</div>

				</el-col>

			</el-row>

			<el-row style="padding: 10px 0;">

				<el-col :span="14" style="min-width: 800px">

					<div class="main" ref="main" style="height:500px;"></div>

				</el-col>

				<el-col :span="10">

					<div v-if="dataUser.length===0">

						<h5 style="padding: 10px 0;">会员到馆上课概况</h5>

						<h5>({{dateTime.startTime}}至{{dateTime.endTime}})</h5>

						<h4>暂无数据...</h4>

					</div>

					<div class="pie" ref="pie" style="height: 500px;"></div>

				</el-col>

			</el-row>

			<el-row style="background: #ccc;line-height: 3;padding: 0 10px;">

				<el-col :span="12" style="text-align: left;">

					实时监控详细数据 ({{dateTime.startTime}}至{{dateTime.endTime}})

				</el-col>

				<el-col :span="12" style="text-align: right;">

					<ExportForm ref='elForm'>

						<el-button native-type='submit' v-if="checkPermission('api/manage/lifehouse/export')" type="primary" :disabled="isExcel" round>导出excel</el-button>

					</ExportForm>

				</el-col>

			</el-row>

			<el-row>

				<el-col :span="24">

					<el-table :data="dataList" style="width: 100%">

						<el-table-column label="序号" type="index" align="center" width="">

						</el-table-column>

						<el-table-column prop="name" align="center" label="生活馆">

						</el-table-column>

						<el-table-column prop="address" align="center" label="地址">

						</el-table-column>

						<el-table-column prop="rdcount" align="center" label="跑步机数量">

						</el-table-column>

						<el-table-column prop="arcount" align="center" label="AR数量">

						</el-table-column>

						<el-table-column prop="bacount" align="center" label="体侧仪数量">

						</el-table-column>

						<el-table-column prop="houseArea" align="center" label="场馆面积(m²)">

						</el-table-column>

						<el-table-column prop="houseCapital" align="center" label="资金投入(元)">

						</el-table-column>

						<el-table-column prop="memberCount" align="center" label="会员数量(人)">

						</el-table-column>

						<el-table-column prop="signCount" align="center" label="会员上课次数(次)">

						</el-table-column>

						<el-table-column prop="electricQuantity" align="center" label="电量(度)">

						</el-table-column>

						<el-table-column prop="waterQuantity" align="center" label="水量(吨)">

						</el-table-column>

					</el-table>

				</el-col>

				<el-col :span="24">

					<div class="block" style="text-align: right;padding-right:20px;">

						<el-pagination @size-change="recordsChange" @current-change="recordsCurrentChange" :current-page="params.page" :page-sizes="[20, 40, 60, 100]" :page-size="params.count" :page-count="params.pageTotal" :total="params.total" layout="total, sizes, prev, pager, next, jumper">

						</el-pagination>

					</div>

				</el-col>

			</el-row>

		</div>

	</el-main>
</template>

<script>
	import {

		api

	} from '@/config/api'

	import {

		restful

	} from '@/servers/server'

	import ExportForm from '@/components/base/exportForm'

	import HouseAreaLinkage from '@/components/base/houseAreaLinkage'

	import {

		tools,

		changIntoChineseDateMod,

		getExportFormComItem

	} from '@/common/tools'

	export default {

		name: 'lifehallView',

		data() {

			return {

				// 是否可点击导出excel

				isExcel: false,

				submit: 'submit',

				// end

				// all_data 数据

				allChina: {

					electricityQuantity: 0,

					electricityToTalQuantity: 0,

					memberCount: 0,

					toltalCaptial: 0,

					totalArea: 0,

					totalMemberCount: 0,

					warterQuantity: 0,

					warterTotalQuantity: 0

				},

				totalDevice: null,

				isLoading: false,

				// 输入框联动start

				linkageObj: {

					province: null,

					city: null,

					house: null,

					area: null

				},

				params: {

					page: 1,

					time: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()],

					count: 20,

					pageTotal: 100,

					total: 100

				},

				dateTime: {

					startTime: '',

					endTime: ''

				},

				dataUser: [],

				provinceList: [],

				cityList: [],

				areaList: [],

				houseList: [],

				dataList: [],

				pickerOptions2: {

					shortcuts: [{

						text: '最近一周',

						onClick(picker) {

							const end = new Date()

							const start = new Date()

							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)

							picker.$emit('pick', [start, end])

						}

					}, {

						text: '最近一个月',

						onClick(picker) {

							const end = new Date()

							const start = new Date()

							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)

							picker.$emit('pick', [start, end])

						}

					}, {

						text: '最近三个月',

						onClick(picker) {

							const end = new Date()

							const start = new Date()

							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)

							picker.$emit('pick', [start, end])

						}

					}],

					disabledDate(time) {

						return time.getTime() > Date.now()

					}

				}

				// 输入框联动end

			}

		},

		// props 可以是数组或对象，用于接收来自父组件的数据

		props: {},

		watch: {

			linkageObj: {

				handler: function(val, oldVal) {

					if(val !== null) {

						this.isExcel = true

					}

				},

				deep: true

			}

		},

		created() {
			// 加载权限验证函数
			this.checkPermission = window.checkPermission
		},

		mounted() {

			let self = this

			// 操作子组件DOM 元素

			self.hEl = self.$refs['houseAreaLinkage']

			// 饼 型 方法

			self.pieClick()
			// end
			// 获得地图数据接口
			self.mapDataRet()
			// 导出表格 start
			self.elForm = self.$refs['elForm']
			self.elForm.$el.action = api.exportData
			// 获取allData 数据
      self.onAllData()
			// 获取分页列表数据
      self.onPage()

		},

		methods: {

			// 地图 初始化

			mapDataRet() {

				let self = this

				let myCharts = echarts.init(self.$refs.main)

				let option = {

					title: {

						text: '',

						//          subtext: 'data from PM25.in',

						//          sublink: 'http://www.pm25.in',

						x: 'center'

					},

					tooltip: {

						trigger: 'item',

						formatter: function(params, ticket, callback) {

							var res = null

							if(params.data.value !== '-') {

								for(var i = 0; i < 2; i++) {

									res = `<div style="padding: 10px;text-align: left"><p>场馆名称 : ${params.name}</p><p>场馆地址 : ${params.data.address}</p><p>场馆面积 : ${params.data.houseArea} (m²)</p><p>资金投入 : ${params.data.houseCapital} (元)</p><p>会员数量 : ${params.data.memberCount} (人)</p><p>会员课时消耗数量 : ${params.data.signCount} (次)</p><p>智能设备数量 : ${params.data.smartDeviceCount}</p></div>`

								}

							}

							return res

						}

					},

					legend: {

						orient: 'vertical',

						x: 'left',

						data: ['热度']

					},

					dataRange: {

						min: 0,

						max: 30,

						calculable: true,

						color: ['lightgreen', 'purple', 'red', 'orange', 'yellow', 'maroon']

					},

					toolbox: {

						show: true,

						orient: 'vertical',

						x: 'right',

						y: 'center',

						feature: {

							//            mark : {show: true},

							//            dataView : {show: true, readOnly: false},

							//            restore: {show: true},

							//            saveAsImage: {show: true}

						}

					},

					series: [{

							name: '热度',

							type: 'map',

							mapType: 'china',

							hoverable: false,

							//            roam:true,

							data: [],

							markPoint: {

								symbolSize: 5, // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2

								itemStyle: {

									normal: {

										borderColor: '#87cefa',

										borderWidth: 1, // 标注边线线宽，单位px，默认为1

										label: {

											show: false

										}

									},

									emphasis: {

										borderColor: '#1e90ff',

										borderWidth: 5,

										label: {

											show: false

										}

									}

								},

								data: []

							},

							geoCoord: {}

						},

						{

							name: 'Top5',

							type: 'map',

							mapType: 'china',

							data: [],

							markPoint: {

								symbol: 'emptyCircle',

								symbolSize: function(v) {

									return 10 + v / 20

								},

								effect: {

									show: true,

									shadowBlur: 0

								},

								itemStyle: {

									normal: {

										label: {

											show: false

										}

									}

								},

								geoCoord: {},

								data: []

							}

						}

					]

				}

				self.mapData((res) => {

					if(res.data.info.length === 0) {

						this.$message({

							type: 'error',

							message: '暂时没有数据'

						})

						return false

					} else {

						//        let currentDate = changIntoChineseDateMod(res.data.endTime)

						option['title']['text'] = `全国运动生活馆分布图\n(截至${changIntoChineseDateMod(res.data.endTime)})`

            self.totalDevice = res.data.info[0].totalDevice

						let arr = res.data.info

						let newArr = []

						// 需要的目标对象

						let obj = {}

						let valueArr = []

						arr.forEach((item) => {

							item['value'] = 30

							valueArr.push(item)

							let newObj = `{"${item['name']}":[${item.longtitude},${item.latitude}]}`

							// 把每个字符串JSON 推进newArr 数组中

							newArr.push(newObj)

						})

						for(var i = 0; i < newArr.length; i++) {

							obj = Object.assign(obj, JSON.parse(newArr[i]))

						}

						//  把数组中每个对象 添加可枚举的对象属性 value = 30,   再赋值给需要的 data 数组

						option['series'][1]['markPoint']['data'] = valueArr

						option['series'][1]['markPoint']['geoCoord'] = obj

						option['series'][0]['geoCoord'] = obj

						myCharts.setOption(option)

					}

				})

			},

			// 饼 型 方法

			pieClick() {

				let self = this

				let myPieCharts = echarts.init(self.$refs.pie)

				// 饼图 start

				let opts = {

					title: {

						text: `会员到馆上课概况`,

						subtext: '',

						x: 'center'

					},

					tooltip: {

						trigger: 'item',

						formatter: '{a} <br/>{b} : {c} ({d}%)'

					},

					legend: {

						orient: 'vertical',

						x: 'left',

						data: []

					},

					toolbox: {

						show: true,

						feature: {

							//            mark: {show: true},

							//            dataView: {show: true, readOnly: false},

							magicType: {

								//              show: true,

								type: ['pie'],

								option: {

									funnel: {

										x: '25%',

										width: '50%',

										funnelAlign: 'left',

										max: 1000000000

									}

								}

							},

							restore: {

								show: true

							},

							saveAsImage: {

								show: true

							}

						}

					},

					calculable: true,

					series: [{

						name: '',

						type: 'pie',

						radius: '55%',

						center: ['50%', '60%'],

						data: []

					}]

				}

				// 获取扇形数据

				self.signUser((res) => {

					self.dataUser = res.data.user

					if(res.data.user.length === 0) {

						this.$message({

							type: 'info',

							message: '暂时没有数据'

						})

						return false

					} else {

						opts['title']['text'] = `会员到馆上课概况`

						opts['title']['subtext'] = `(${changIntoChineseDateMod(res.data.startTime)}至${changIntoChineseDateMod(res.data.endTime)})`

						if(res.data.user.length === 0) {

							return false

						} else {

							opts.series[0]['data'] = res.data.user.map((obj) => {

								let newObj = {

									value: obj.count,

									name: obj.description

								}

								return newObj

							})

							opts.legend['data'] = res.data.user.map((obj) => {

								let newArr = []

								newArr.push(obj.description)

								return newArr

							})

						}

						myPieCharts.setOption(opts)

					}

				})

			},

			// 时间改变， 导出方法

			isTimeChange() {

				this.isExcel = true

			},

			// 查询方法

			onQuery() {

				// 获取allData 数据

				this.onAllData()

				// 获取扇形数据

				this.pieClick()

				// 获取分页列表数据

				this.onPage()

			},

			// 导出表格方法

			// 获得所有数据

			onAllData() {

				let self = this

				let param = {

					cityId: self.linkageObj.city,

					regionId: self.linkageObj.area,

					startTime: tools.standTosimple(self.params.time[0]),

					endTime: tools.standTosimple(self.params.time[1]),

					gymId: self.linkageObj.house,

					provinceId: self.linkageObj.province

				}

				//若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段

				let config = {

					//请求地址

					url: api.allData,

					//请求体参数

					param: param,

					//当前请求的缓冲字段名称

					loading: "isLoading",

				}

				/**

         * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象

         * @config  {Object} 请求的参数主体

         * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数

         * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应

         */

				restful.sendMyData(config, self, function(res) {

					if(res.code === 2000 && res.success === true && res.msg === 'OK') {

						if(res.data.length === 0) {

							self.allChina = []

							return false

						} else {

							self.allChina = res.data

						}

					}

				});

			},

			// 分页列表数据方法

			onPage() {

				let self = this;

				let param = {

					cityId: self.linkageObj.city,

					regionId: self.linkageObj.area,

					count: self.params.count,

					startTime: tools.standTosimple(self.params.time[0]),

					endTime: tools.standTosimple(self.params.time[1]),

					gymId: self.linkageObj.house,

					page: self.params.page - 1,

					provinceId: self.linkageObj.province

				}

				//若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段

				let config = {

					//请求地址

					url: api.pageStatistics,

					//请求体参数

					param: param,

					//当前请求的缓冲字段名称

					loading: "isLoading"

				}

				/**

         * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象

         * @config  {Object} 请求的参数主体

         * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数

         * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应

         */

				restful.sendMyData(config, self, function(res) {

					if(res.code === 2000 && res.success === true && res.msg === 'OK') {

						if(res.data.info.length === 0) {

							self.dataList = []

							self.params.total = 0

							return false

						} else {

							self.dataList = res.data.info

							self.params.total = res.page_info.total

						}

						self.isExcel = false

						self.elForm.refresh(getExportFormComItem(param))

					}

				})

			},

			// 扇形方法

			signUser(callback) {

				let self = this

				let param = {

					cityId: self.linkageObj.city,

					regionId: self.linkageObj.area,

					startTime: tools.standTosimple(self.params.time[0]),

					endTime: tools.standTosimple(self.params.time[1]),

					gymId: self.linkageObj.house,

					provinceId: self.linkageObj.province

				}

				//若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段

				let config = {

					//请求地址

					url: api.signUser,

					//请求体参数

					param: param,

					//当前请求的缓冲字段名称

					loading: "isLoading"

				}

				/**

         * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象

         * @config  {Object} 请求的参数主体

         * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数

         * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应

         */

				restful.sendMyData(config, self, (res) => {

					if(res.code === 2000 && res.success === true && res.msg === 'OK') {

						self.dateTime.startTime = res.data.startTime

						self.dateTime.endTime = res.data.endTime

						self.dateTime.startTime = changIntoChineseDateMod(self.dateTime.startTime)

						self.dateTime.endTime = changIntoChineseDateMod(self.dateTime.endTime)

						callback(res)

					}

				})

			},

			// 地图方法

			mapData(callback) {

				let self = this

				let param = {
					endTime: tools.standTosimple(self.params.time[1])
				}

				//若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段

				let config = {

					//请求地址

					url: api.mapChina,

					//请求体参数

					param: param,

					//成功时的处理消息 错误信息由后台控制打印

					okMsg: "",

					//当前请求的缓冲字段名称

					loading: "isLoading",

					//需要改变的对象的键值 需与接口返回的字段名称对应 若和接口返回的不一样只能获得undefined

					changeKeyArr: ['allChina']

				}

				/**

         * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象

         * @config  {Object} 请求的参数主体

         * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数

         * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应

         */

				restful.sendMyData(config, self, (res) => {

					if(res.code === 2000 && res.success === true && res.msg === 'OK') {

						callback(res)

					}

				})

			},

			// 当前页数改变触发函数

			recordsCurrentChange(val) {

				this.params.page = val

				// 获取分页列表数据

				this.onPage()

			},

			// 每页条数改变触发函数

			recordsChange(val) {

				this.params.count = val

				// 获取分页列表数据

				this.onPage()

			},

			/**

       * 刷新当前的regionId

       * @val {String} 当前的省id

       */

			setProvince(val) {

				this.linkageObj.province = val

			},

			/**

       * 刷新当前的regionId

       * @val {String} 当前的市id

       */

			setCity(val) {

				this.linkageObj.city = val

			},

			/**

       * 刷新当前的regionId

       * @val {String} 当前的区id

       */

			setArea(val) {

				this.linkageObj.area = val

			},

			/**

       * 刷新当前的lifeId

       * @val {String} 当前的区lifeId

       */

			setHouse(val) {

				this.linkageObj.house = val

			},

			// 重置

			reset() {

				this.hEl.setProvince()

				this.hEl.setCity()

				this.hEl.setArea()

				this.hEl.setHouse()

			}

		},

		components: {

			ExportForm,

			HouseAreaLinkage

		}

	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
	.row {
		margin-bottom: 20px;
		min-height: 32px;
		height: auto;
		text-align: left;
	}

	.houseAreaLinkage_select {
		display: inline-block;
		padding: 10px 0;
	}

	.houseAreaLinkage_input {
		text-align: left;
		padding: 10px 0;
		line-height: 32px;
		display: inline-block;
	}

	p {
		padding: 5px 0;
	}

	.amap-page-container {
		height: 500px;
	}
	/*去掉窗体(小圆点)背景图*/

	.main .echarts-tooltip {
		padding: 0 !important;
	}

	#all_data div {
		padding: 10px 0;
	}

	#all_data div>p:nth-child(2) {
		font-size: 24px;
	}
</style>
