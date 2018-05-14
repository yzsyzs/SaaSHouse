<!--/*
 * @Author: yzs
 * @Date:   2017-11-29 11:05:12
 * @Last Modified by:   yzs
 * @Last Modified time: 2017-11-29 11:05:15
 */-->
<template>
	<el-main>
		<section class="signRecord_main" v-if="checkPermission('api/manage/privilegecard/getCardImageList')">
			<el-row>
				<el-col :span="24">
					上传卡背景图:
				</el-col>
				<el-col :span="24" style="padding: 10px 0;">
					<div>
						卡类:
						<el-select class="w300" v-model="params.cardType" @change="changeType" placeholder="请选择">
							<el-option label="次卡" value="0"></el-option>
							<el-option label="期限卡" value="1"></el-option>
							<el-option label="课程赠卡" value="2"></el-option>
							<el-option label="京东卡" value="3"></el-option>
						</el-select>
					</div>
				</el-col>
				<el-col :span="24" v-if="params.cardType" style="padding: 10px 0;">
					现有图片 :
				</el-col>
				<el-col :span="24" style="width:65%" v-if="params.cardType">
					<up-load :upImgArr='detailImg' v-show="checkPermission('api/manage/privilegecard/saveCardImages')" :imageWidth='listImgWidth' :imageHeight='listImgHeight' :maxlength="imgMaxLength" @getImgArr="getDetailImgArr" ref='detailImg'>
					</up-load>
					<div v-for="(item, index) in params.detailImgArr" :key="index" class="yetUploadImgDetail">
						<img :src="item.url" alt="" />
						<i class="delImg" v-if="checkPermission('api/manage/privilegecard/deleteCardImage')" @click="delDetailImg(item)"></i>
					</div>
				</el-col>
			</el-row>
		</section>
	</el-main>
</template>

<script>
	import upLoad from '@/components/upload/imgUpload'
	//  import { responeCode } from '@/config/config'
	import { restful } from '@/servers/server'
	import { api } from '@/config/api'
	export default {
		name: 'uploadImage',
		data() {
			return {
				params: {
					cardType: '',
					detailImgArr: []
				},
				listImgHeight: 400,
				listImgWidth: 690,
				detailImg: 'detailImg',
				imgMaxLength: 5
			}
		},
		computed: {},
		mounted() {

		},
    created () {
      // 加载权限验证函数
      this.checkPermission = window.checkPermission
    },
		methods: {
			// 根据卡的值  请求服务器拿到对应的图片数组
			changeType(val) {
				/*if (val === '2' || val === '3') {
				  this.imgMaxLength = 2
				} else {
				  this.imgMaxLength = 100
				}*/
				this.onQuery()
			},
			// 请求服务器获取图片列表数据方法
			onQuery() {
				let self = this
				let params = {
					cardType: self.params.cardType
				}
				//若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
				let config = {
					//请求方式
					method: 'post',
					//请求地址
					url: api.getCardImageList,
					//请求体参数
					param: params
				}
				/**
				 * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
				 * @config  {Object} 请求的参数主体
				 * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
				 * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
				 */

				restful.sendMyData(config, self, (res) => {
					if(res.code === 2000 && res.success === true && res.msg === 'OK') {
						console.log(res.data)
						let newArr = res.data
						let arr = newArr.map((item) => {
							let newObj = {
								id: item.id,
								imgId: item.imgId,
								url: item.imgUrl
							}
							return newObj
						})
						self.params.detailImgArr = arr
						self.$refs['detailImg'].init(self.params.detailImgArr)
					}
				})
			},
			// 获取图片数组数据
			getDetailImgArr(detailImgArr) {
				let self = this
				// 永远获取 形参 的最后一个对象放进 保存请求的参数中 newArr
				let arr = detailImgArr.map((item) => {
					let obj = {
						imgDetailId: item.imgId,
						imgDetailUrl: item.url
					}
					return obj
				})
				let newArr = []
				newArr.push(arr.pop())
				let param = {
					cardType: self.params.cardType,
					images: newArr
				}
				//若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
				let config = {
					//请求方式
					method: 'post',
					//请求地址
					url: api.saveCardImages,
					//请求体参数
					param: param
				}
				/**
				 * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
				 * @config  {Object} 请求的参数主体
				 * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
				 * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
				 */
				restful.sendMyData(config, self, (res) => {
					if(res.code == 2000) {
						let dataArr = res.data || []
						let arr = dataArr.map((item) => {
							let newObj = {
								id: item.id,
								imgId: item.imgId,
								url: item.imgUrl
							}
							//去重
							let isHave = false;
							self.params.detailImgArr.forEach((it,i)=>{
								if(it.imgId == newObj.imgId){
									it.id =  newObj.id
									isHave = true
								}
							})
							//若当前的数组不存在则返回
							if(!isHave){
								self.params.detailImgArr.push(newObj)
								console.log()
							}
						})
					} else {
						self.$message.error(res.msg)
					}

				})
			},
			// 删除 选中 图片
			delDetailImg(childImg) {
				console.log(childImg)
				let self = this;
				//若需要特殊请求头则需要增加  headers 和 requestHeader 两个字段
				let config = {
					//请求方式
					method: 'post',
					//请求地址
					url: api.deleteCardImage,
					//请求体参数
					param: {
						id: childImg.id
					}
				}
				/**
				 * 定义通用的请求函数 此方法必须传两个参数 config，和 执行函数的this目标对象
				 * @config  {Object} 请求的参数主体
				 * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数
				 * @changeKeyArr {Array} 需要改变的对象的键值 需与接口返回的字段名称对应
				 */
				self.$confirm('确定删除该图片吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					restful.sendMyData(config, self, (res) => {
						if(res.code === 2000 && res.success === true && res.msg === 'OK') {
							// 是京东卡、课程附赠卡 必须保留一张图片
							if(self.params.cardType > 1) {
								// 剩下最后一张图片不可被删除
								if(self.params.detailImgArr.length > 1) {
									self.params.detailImgArr = self.params.detailImgArr.filter((item) => {
										return item.imgId !== childImg.imgId
									})
								} else {
									self.$message({
										type: 'info',
										message: '要保留一张图片哦，请上传另外一张图片再试试 !'
									})
								}
							} else {
								// 否则其他卡类的图片可以删除为空，但是有被使用的图片 不可删除
								self.params.detailImgArr = self.params.detailImgArr.filter((item) => {
									return item.imgId !== childImg.imgId
								})
							}
							self.$refs['detailImg'].init(self.params.detailImgArr)
						} else {
							self.$message.error(res.msg)
						}
					})
				}).catch(() => {
					self.$message({
						type: 'info',
						message: '取消删除'
					})
				})
			}
		},
		components: {
			upLoad
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
	}

	.yetUploadImgDetail {
		display: inline-block;
		margin-right: 10px;
		width: 160px;
		height: 120px;
		position: relative;
		overflow: hidden;
	}

	.yetUploadImgDetail img {
		width: 100%;
	}

	.yetUploadImgDetail i.delImg {
		display: block;
		width: 24px;
		height: 24px;
		position: absolute;
		right: 0;
		top: 0;
		background: url('../../assets/images/icon_closeimg.png');
	}
</style>
