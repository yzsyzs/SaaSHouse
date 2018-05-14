<!--
  亲友网络
  @作者: chanwefun
-->
<template>
<section>
  <el-form :inline='true' :rules="rules" :model="ruleForm" ref="ruleForm">
    <el-row class="txall">
      <el-select v-model="ruleForm.searchType" clearable placeholder="请选择" size="medium" @change='setSelectType'>
        <el-option v-for="item in searchTypeArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-form-item prop='mallId' v-if='ruleForm.searchType === 1'>
        <el-input v-model="ruleForm.mallId" placeholder="请正确输入要查询的猫号" style="width: 200px" size="medium"></el-input>
      </el-form-item>
      <el-form-item prop='phone' v-else>
        <el-input v-model="ruleForm.phone" placeholder="请正确输入要查询的手机号" style="width: 200px" size="medium"></el-input>
      </el-form-item>
    </el-row>
    <el-row class="txall">
      <el-form-item>
        <!-- <i :style="styleObject" class="left-to-right"></i> -->
        <el-button round type="primary" icon="el-icon-search" size="medium" :loading='loading' @click="submitForm('ruleForm')">查询</el-button>
        <el-button round type="info" size="medium" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-row>
  </el-form>

  <el-row v-if='!result'>
    <h1>暂无数据</h1>
  </el-row>
  <el-row v-if='result'>
    <el-row>
      <table class="">
        <tbody>
          <tr>
            <td class="" style="width: 25%;">本人</td>
            <td class="" style="width: 25%;">上级</td>
            <td class="" style="width: 25%;">上上级</td>
            <td class="" style="width: 25%;">上上上级</td>
          </tr>
          <tr>
            <td @click='showPopup(result.myInformation)'>
              {{result.myInformation && result.myInformation.userName || "无"}}
              <span
                v-if="result.myInformation && result.myInformation.millId"
                style="color: #ccc;"
              >
                ({{result.myInformation && result.myInformation.millId}})
              </span>
            </td>
            <td @click='showPopup(result.higherRelatives && result.higherRelatives.firstHigherRelatives)'>
              {{result.higherRelatives && result.higherRelatives.firstHigherRelatives && result.higherRelatives.firstHigherRelatives.userName || "无"}}
              <span
                v-if="result.higherRelatives && result.higherRelatives.firstHigherRelatives.millId"
                style="color: #ccc;"
              >
                ({{result.higherRelatives && result.higherRelatives.firstHigherRelatives.millId}})
              </span>
            </td>
            <td @click="showPopup(result.higherRelatives && result.higherRelatives.secondHigherRelatives)">
              {{result.higherRelatives && result.higherRelatives.secondHigherRelatives && result.higherRelatives.secondHigherRelatives.userName || "无"}}
              <span
                v-if="result.higherRelatives && result.higherRelatives.secondHigherRelatives && result.higherRelatives.secondHigherRelatives.millId"
                style="color: #ccc;"
              >
                ({{result.higherRelatives && result.higherRelatives.secondHigherRelatives.millId}})
              </span>
            </td>
            <td @click="showPopup(result.higherRelatives && result.higherRelatives.thirdHigherRelatives)">
              {{result.higherRelatives && result.higherRelatives.thirdHigherRelatives && result.higherRelatives.thirdHigherRelatives.userName || "无"}}
              <span
                v-if="result.higherRelatives && result.higherRelatives.thirdHigherRelatives && result.higherRelatives.thirdHigherRelatives.millId"
                style="color: #ccc;">
                ({{result.higherRelatives && result.higherRelatives.thirdHigherRelatives && result.higherRelatives.thirdHigherRelatives.millId}})
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </el-row>

    <el-row class="pdt20 txall">
      <h3 style="font-size: 14px;">亲友网络人数合计({{result.totalCount || 0}}人)</h3>
      <el-row class="pdt10">
        <p style="font-size: 14px;">【1】一级亲友({{result.firstCount || 0}}人)</p>
          <!-- :class="width100: `${result.firstRelativesTr[0].length > 10 ? 100 : result.firstRelativesTr[0].length * 10}`" -->
        <table
          class="pdt10"
          :style="{width: result.firstRelativesTr[0].length > 10 ? 100 : result.firstRelativesTr[0].length * 10 + '%'}"
        >
          <tbody>
              <tr v-for="firstTr in result.firstRelativesTr.slice(0, 3)">
                  <td v-for="first in firstTr" style="width:10%;padding: 0!important;text-align: center">
                      <span v-if="first.userName" @click="showPopup(first)">
                          {{first.userName}}
                          <span
                            v-if="result.myInformation.millId"
                            style="color: #ccc;line-height: 16px;">
                            ({{first.millId}})
                          </span>
                      </span>
                  </td>
              </tr>
              <tr v-show="isShowOther[0]" v-for="(firstTr, index) in result.firstRelativesTr.slice(3, result.firstRelativesTr.length)">
                  <td v-for="first in firstTr" style="width:10%;padding: 0!important;text-align: center">
                      <span v-if="first.userName" @click="showPopup(first)">{{first.userName}}
                          <span
                          v-if="result.myInformation.millId"
                          style="color: #ccc;line-height: 16px;">
                          ({{first.millId}})
                          </span>
                      </span>
                  </td>
              </tr>
          </tbody>
        </table>
        <div
          v-show="result.firstRelativesTr.length > 3"
          class="pdt10"
          style="margin-bottom: 10px;text-align: center;cursor: pointer">
          <span
            @click="isSpread(0, false)"
            class="col-md-12 text-center isSpread"
            v-if="isShowOther[0]"
          >
            <i class="el-icon-arrow-up"></i>收起
          </span>
          <span
            @click="isSpread(0, true)"
            class="col-md-12 text-center isSpread"
            v-if="!isShowOther[0]">
            <i class="el-icon-arrow-down"></i> 展开查看更多
          </span>
        </div>
      </el-row>

      <el-row class="pdt10">
        <p style="font-size: 14px;">【2】二级亲友({{result.secondCount || 0}}人)</p>
        <table
          class="pdt10"
          :style="{width: result.secondRelativesTr[0].length > 10 ? 100 : result.secondRelativesTr[0].length * 10 + '%'}"
        >
          <tbody>
              <tr v-for="secondTr in result.secondRelativesTr.slice(0, 3)">
                  <td v-for="second in secondTr" style="width:10%;padding: 0!important;text-align: center">
                      <span v-if="second.userName" @click="showPopup(second)">
                          {{second.userName}}
                          <span
                            v-if="result.myInformation.millId"
                            style="color: #ccc;line-height: 16px;">
                            ({{second.millId}})
                          </span>
                      </span>
                  </td>
              </tr>
              <tr v-show="isShowOther[1]" v-for="secondTr in result.secondRelativesTr.slice(3, result.secondRelativesTr.length)">
                  <td v-for="second in secondTr" style="width:10%;padding: 0!important;text-align: center">
                      <span v-if="second.userName" @click="showPopup(second)">{{second.userName}}
                          <span
                          v-if="result.myInformation.millId"
                          style="color: #ccc;line-height: 16px;">
                          ({{second.millId}})
                          </span>
                      </span>
                  </td>
              </tr>
          </tbody>
        </table>
        <div
          v-show="result.secondRelativesTr.length > 3"
          class="pdt10"
          style="margin-bottom: 10px;text-align: center;cursor: pointer">
          <span
            @click="isSpread(1, false)"
            class="col-md-12 text-center isSpread"
            v-if="isShowOther[1]"
          >
            <i class="el-icon-arrow-up"></i>收起
          </span>
          <span
            @click="isSpread(1, true)"
            class="col-md-12 text-center isSpread"
            v-if="!isShowOther[1]">
            <i class="el-icon-arrow-down"></i> 展开查看更多
          </span>
        </div>
      </el-row>

      <el-row class="pdt10">
        <p style="font-size: 14px;">【3】三级亲友({{result.thirdCount || 0}}人)</p>
        <table
          class="pdt10"
          :style="{width: result.thirdRelativesTr[0].length > 10 ? 100 : result.thirdRelativesTr[0].length * 10 + '%'}">
          <tbody>
              <tr v-for="thirdTr in result.thirdRelativesTr.slice(0, 3)">
                  <td v-for="third in thirdTr" style="width:10%;padding: 0!important;text-align: center">
                      <span v-if="third.userName" @click="showPopup(third)">
                          {{third.userName}}
                          <span
                            v-if="result.myInformation.millId"
                            style="color: #ccc;line-height: 16px;">
                            ({{third.millId}})
                          </span>
                      </span>
                  </td>
              </tr>
              <tr v-show="isShowOther[2]" v-for="thirdTr in result.thirdRelativesTr.slice(3, result.thirdRelativesTr.length)">
                  <td v-for="third in thirdTr" style="width:10%;padding: 0!important;text-align: center">
                      <span v-if="third.userName" @click="showPopup(third)">{{third.userName}}
                          <span
                          v-if="result.myInformation.millId"
                          style="color: #ccc;line-height: 16px;">
                          ({{third.millId}})
                          </span>
                      </span>
                  </td>
              </tr>
          </tbody>
        </table>

        <div
          v-show="result.thirdRelativesTr.length > 3"
          class="pdt10"
          style="margin-bottom: 10px;text-align: center;cursor: pointer">
          <span
            @click="isSpread(2, false)"
            class="col-md-12 text-center isSpread"
            v-if="isShowOther[2]"
          >
            <i class="el-icon-arrow-up"></i>收起
          </span>
          <span
            @click="isSpread(2, true)"
            class="col-md-12 text-center isSpread"
            v-if="!isShowOther[2]">
            <i class="el-icon-arrow-down"></i> 展开查看更多
          </span>
        </div>
      </el-row>

    </el-row>

    <el-row>
      <div style="width: 25%; display: inline-block;" >
        <p style="font-size: 14px;color: #ccc;text-align: center;padding: 20px 0;">一级亲友（{{result.firstCount}}人）</p>
        <div class="col-md-12">
          <div
            class="relative"
            style="position: relative;"
            v-for="(firstDetail, index) in firstRelativesDetails.slice(0, 10)">
            <p
                style="text-align: center;"
                @click="showDetail('first', firstDetail, $event, index)">
                {{firstDetail.userName}}（{{firstDetail.quantity || 0}}）
            </p>
            <i
              class="left-to-right"
              v-show="firstRelativesI === index"
              :style="styleObject">
            </i>
          </div>
          <div
            v-show="isShowOther[3]"
            class="relative"
            style="position: relative;"
            v-for="(firstDetail, index) in firstRelativesDetails.slice(10, firstRelativesDetails.length)">
            <p
                style="text-align: center;"
                @click="showDetail('first', firstDetail, $event, index + 10)">
                {{firstDetail.userName}}（{{firstDetail.quantity || 0}}）
            </p>
            <i
                class="left-to-right"
                v-show="firstRelativesI === index + 10"
                :style="styleObject"></i>
          </div>
          <div v-show="firstRelativesDetails.length > 10" class="col-md-12" style="margin-bottom: 10px;margin-top: 10px;">
            <span
              @click="isSpread(3, false)"
              class="col-md-12 text-center isSpread"
              v-if="isShowOther[3]"
            >
              <i class="el-icon-arrow-up"></i>收起

            </span>
            <span
              @click="isSpread(3, true)"
              class="col-md-12 text-center isSpread"
              v-if="!isShowOther[3]"
            >
              <i class="el-icon-arrow-down"></i>展开查看更多
            </span>
          </div>
        </div>
      </div>

      <div style="width: 25%;display:inline-block;margin-left: 8.3%" >
        <p style="font-size: 14px;color: #ccc;text-align: center;padding: 20px 0;">二级亲友（{{result.secondCount}}人）</p>
        <div class="col-md-12" ref="relatives__second-detail" id='relatives__second-detail' style="top: 0px;position: relative">
            <div
                class="relative"
                style="position: relative;"
                v-for="(secondDetail, index) in secondRelativesDetails.slice(0, 10)">
                <p
                  @click="showDetail('second', secondDetail, $event, index)"
                  style="text-align: center;"
                >
                    {{secondDetail.userName}}（{{secondDetail.quantity || 0}}）
                </p>
                <i
                  class="left-to-right"
                  v-show="secondRelativesI === index"
                  :style="styleObject"
                ></i>
            </div>
            <div
                v-show="isShowOther[4]"
                style="position: relative;"
                class="relative"
                v-for="(secondDetail, index) in secondRelativesDetails.slice(10, secondRelativesDetails.length)">
                <p
                    style="text-align: center;"
                    @click="showDetail('second', secondDetail, $event, index + 10)">
                    {{secondDetail.userName}}（{{secondDetail.quantity || 0}}）
                </p>
                <i
                  class="left-to-right"
                  v-show="secondRelativesI === index + 10"
                  :style="styleObject"
                ></i>
            </div>
            <div v-show="secondRelativesDetails.length > 10" class="col-md-12" style="margin-bottom: 10px;margin-top: 10px;">
                <span
                    @click="isSpread(4, false)"
                    class="col-md-12 text-center isSpread"
                    v-if="isShowOther[4]">
                        <i class="el-icon-arrow-up"></i>
                        收起
                </span>
                <span
                    @click="isSpread(4, true)"
                    class="col-md-12 text-center isSpread"
                    v-if="!isShowOther[4]">
                        <i class="el-icon-arrow-down"></i>
                        展开查看更多
                </span>
            </div>
        </div>
      </div>

      <div style="width: 25%; display:inline-block;margin-left: 8.3%" >
        <p style="font-size: 14px;color: #ccc;text-align: center;padding: 20px 0;">三级亲友（{{result.thirdCount}}人）</p>
        <div class="col-md-12" ref="relatives__third-detail" id='relatives__third-detail' style="top: 0px;position: relative">
            <div class="relative" v-for="thirdDetail in thirdRelativesDetails.slice(0, 10)">
                <p
                    style="text-align: center;"
                    @click="showDetail('third', thirdDetail, $event)">
                    {{thirdDetail.userName}}（{{thirdDetail.quantity || 0}}）
                </p>
            </div>

            <div v-show="isShowOther[5]" class="relative" v-for="thirdDetail in thirdRelativesDetails.slice(10, thirdRelativesDetails.length)">
                <p
                    style="text-align: center;"
                    @click="showDetail('third', thirdDetail, $event)">
                    {{thirdDetail.userName}}（{{thirdDetail.quantity || 0}}）
                </p>
            </div>


            <div v-show="thirdRelativesDetails.length > 10" class="col-md-12" style="margin-bottom: 10px;margin-top: 10px;">
                <span
                    @click="isSpread(5, false)"
                    class="col-md-12 text-center isSpread"
                    v-if="isShowOther[5]">
                        <i class="el-icon-arrow-up"></i>
                        收起
                </span>
                <span
                    @click="isSpread(5, true)"
                    class="col-md-12 text-center isSpread"
                    v-if="!isShowOther[5]"
                >
                  <i class="el-icon-arrow-down"></i>
                  展开查看更多
                </span>
            </div>
        </div>
      </div>
    </el-row>

  </el-row>

</section>
</template>

<script>
import { restful } from '@/servers/server'
import { responeCode } from '@/config/config'
import {api} from '@/config/api'
import axios from 'axios'
import toRight from '@/assets/images/icon_qywl@2x.png'
import moment from 'moment'
export default {
  // 组件的名称
  name: 'relatives',
  // props 可以是数组或对象，用于接收来自父组件的数据
  props: {},
  // 数据绑定
  data() {
    return {
      styleObject: { background: 'url(' + toRight + ')' },
      loading: false,
      ruleForm: {
        searchType: 2,
        mallId: '',
        phone: ''
      },
      searchTypeArr: [{ id: 1, name: "猫号(必填)" }, { id: 2, name: "手机号(必填)" }],
      rules: {
        mallId: [{ required: true, message: '请输入猫号', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }]
      },
      result: null,
      firstRelativesDetails: [],
      secondRelativesDetails: [],
      thirdRelativesDetails: [],
      isShowOther: [false, false, false, false, false, false]
    }
  },

  // 组件
  components: {},

  // 方法
  methods: {
    /*
     * 设置查询的类型
     */
    setSelectType(val) {
      var self = this
      self.ruleForm.mallId = ''
      self.ruleForm.phone = ''
      // return (((val === 1) && (self.ruleForm.mallId = val)) || (self.ruleForm.phone = val))
    },
    /*
     * 提交表单
     */
    submitForm(formName) {
      let self = this
      self.loading = true
      self.$refs[formName].validate((valid) => {
        if (valid) {
          self.query()
        } else {
          self.loading = false
          console.warn('error submit!!')
          return false
        }
      });
    },

    /*
     * 提交查询请求
     */
    query() {
      let self = this
      // 清空详情的数据
  		self.firstRelativesDetails = []
  		self.secondRelativesDetails = []
  		self.thirdRelativesDetails = []
  		self.firstRelativesI = null
	    self.secondRelativesI = null
	    self.result = null

      var getRelativesAllParam = {
				url : api.getRelativesAllUrl,
				params: {
					mallId: self.ruleForm.mallId,
					telephone: self.ruleForm.phone,  // 17603058632
				}
			};
      axios({
        url: api.getRelativesAll,
        method: 'POST',
        data: getRelativesAllParam
      }).then((res) => {
        self.loading = false
        if(res.data && res.data.code == responeCode.OK) {
  				self.result = res.data && res.data.data.Relatives;
  				// 统计数量
  				self.result.firstCount = self.result.relativesDetails.firstRelativesDetails && self.result.relativesDetails.firstRelativesDetails.length;
  				self.result.secondCount = self.result.relativesDetails.secondRelativesDetails && self.result.relativesDetails.secondRelativesDetails.length;
  				self.result.thirdCount = self.result.relativesDetails.thirdRelativesDetails && self.result.relativesDetails.thirdRelativesDetails.length;
  				self.result.totalCount = self.result.firstCount + self.result.secondCount + self.result.thirdCount;
  				// 每一级亲友的数据
  				self.result.firstRelativesTr = self.splitArr(self.result.relativesDetails.firstRelativesDetails || []);
  				self.result.secondRelativesTr = self.splitArr(self.result.relativesDetails.secondRelativesDetails || []);
  				self.result.thirdRelativesTr = self.splitArr(self.result.relativesDetails.thirdRelativesDetails || []);
  				var	getRelativesDetailsByRedIdParam = {
  						url: api.getRelativesDetailsByRedIdUrl,
  		    		params: {
  		    			myMallId: self.result.myInformation.millId,
  		    			redId: "",
  		    		}
  					};
  				axios({
            url: api.getRelativesDetailsByRedId,
            method: 'POST',
            data: getRelativesDetailsByRedIdParam
          }).then((res) => {
            if(res.data && res.data.code == responeCode.OK) {
              self.firstRelativesDetails = res.data && res.data.data.RelativesDetails;
            } else {
              return self.$message.error(res.data && res.data.msg)
            }
  				}, (rej) => {
            console.warn('relatives methods query rej ', rej)
            return false
          })
  			} else {
  				return self.$message.error(res.data && res.data.msg)
  			}
      }, (rej) => {
        self.loading = false
        console.warn('relatives methods query rej ', rej)
        return false
      })
    },

    /*
     * 重置
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    /*
  	 * 分隔数组为多维数组
  	 * arr：要进行分隔的数组
  	 * len：要分隔成多长的子数组
  	 * return：返回新的分隔好的数组
  	 */
  	splitArr(arr, len) {
  		var len = len || 10;
  		var res = [];
  		var arrLen = arr.length;
  		if(arrLen <= len) {
  			res[0] = arr
  			return res;
  		}

  		// 要把原数组分成几个维度的数组，dimension定义维度，向上取整
  		var dimension = Math.ceil(arrLen / len);
  		for(var j = 0 ; j < dimension; j ++) {
  			var start = j + j * (len - 1);
  			var end = start + len;
  			if(!res[j] || res[j].length === 0) res[j] = arr.slice(start, end);
  		}
  		return res;
  	},

	  /*
	   * 显示弹窗，当点击表格亲友的时候需要显示入团馆名跟入团日期的信息
	   * return：null
	   */
    showPopup(obj) {
    	if(!obj) return false;
      this.$alert("<p><strong>入团馆名: </strong><strong class='fr'>"+ obj.venuesName +"</strong></p><p class='pdt10'><strong>入团时间: </strong><strong class='fr'>"+ moment(obj.createTime).format("YYYY-MM-DD") +"</strong></p>", '提示', {
          dangerouslyUseHTMLString: true
        }).then(() => {}, () => {});
    },

    /*
     * 收起、 展开功能
     * index: 当前是点击哪个 收起/展开
     * bool：是否要展开
     * return：null
     */
	  isSpread(index, bool){
      this.$set(this.isShowOther, index, bool)
  	},

    /*
  	 * 显示一二级亲友详情
  	 * level：点击的是哪个级别的亲友
  	 * obj：点击的对象
  	 * event：当前对象的事件对象
  	 * return: null；
  	 */
  	showDetail(level, obj, event, index) {
      let self = this
    	if(!obj.quantity) return false;
    	var level = level || "first";
    	var serchParam = {
    		url: api.getRelativesDetailsByRedIdUrl,
    		params: {
    			myMallId: self.result.myInformation.millId,
    			redId: obj.redId,
    		}
    	}
    	switch(level) {
    		case 'first':
    			// 清空二级、三级亲友的数据
      		self.secondRelativesDetails = [];
      		self.thirdRelativesDetails = [];
      		self.firstRelativesI = null;
      		self.secondRelativesI = null;
      		axios({
            url: api.getRelativesDetailsByRedId,
            method: "POST",
            data: serchParam
          }).then(function(res) {
      			if(res.data && res.data.code == responeCode.OK) {
      				self.firstRelativesI = index;
      				self.secondRelativesDetails = res.data && res.data.data.RelativesDetails;
              document.getElementById('relatives__second-detail').style.top = event.target.offsetParent.offsetTop - 90 + 'px'
      			} else {
  					return self.$message.error(res.msg + " 服务器状态码：" + res.code)
  				}
  			})
      		break;
    		case 'second':

    			// 清空三级亲友的数据
    			self.thirdRelativesDetails = [];
    			self.secondRelativesI = null;
    			axios({
            url: api.getRelativesDetailsByRedId,
            method: "POST",
            data: serchParam
          }).then(function(res) {
      			if(res.data && res.data.code == responeCode.OK) {
      				self.secondRelativesI = index;
      				self.thirdRelativesDetails = res.data && res.data.data.RelativesDetails;
              document.getElementById('relatives__third-detail').style.top = parseInt(document.getElementById('relatives__second-detail').style.top.split('px')[0]) + (index * 63) + 'px'
      			} else {
  					return self.$message.error(res.msg + " 服务器状态码：" + res.code)
  				}
  			});
      		break;
      	default:
      		break;
    	}
    }
  },

  // 常用钩子函数，总共有8个，可以参照vue的生命周期看

  // 完成了 data 数据的初始化，el没有，就是说页面的dom没有完成转化，还是 {{data}} 这种
  created() {},

  // 完成挂载，相当于dom ready
  mounted() {},

  // 销毁，可以做一些定时器的消费等操作
  destored() {},
}
</script>

<style scoped>
.pdt20 { padding-top: 20px;}
.pdt10 { padding-top: 10px}
.bb {border-bottom: 1px solid #e7e7e7;}
.pd0 { padding: 2px!important;}
.text-center { text-align: center;}
.relative { padding: 12px 0 0 20px; border: 1px solid #ccc; margin-top: 20px; background: #f8f8f8; cursor: pointer;}
.col-md-12 { float: left; width: 100%;}
.left-to-right { width: 24px; height: 20px; display: inline-block; position: absolute; left: 460px; top: 10px;}
p { margin: 0 0 10px; font-size: 14px;}
table { width: 100%; }
tr{ height: 40px; background: #fff;}
td{ cursor: pointer; font-size: 12px!important;border: 1px solid #ddd;padding: 2px!important;}

</style>
