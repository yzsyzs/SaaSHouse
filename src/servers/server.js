//定义全局的请求函数
import axios from 'axios'
var promise;
export var restful = {
  fetch(item) {
    let config = {
      method: item.method ? item.method : 'post',
      url: item.url,
      data: item.isJson == true ? JSON.stringify(item.param) : item.param,
      headers:{
        'X-Requested-With': item.headers ? item.headers : 'XMLHttpRequest',
        'Content-Type':  item.requestHeader ? item.requestHeader :'application/json',
        crossDomain: true,
      },
      requestHeader: {
        'Content-Type':  item.requestHeader ? item.requestHeader :'application/json',
        crossDomain: true,
      },
    }
    promise = axios(config).then((response) => {
      return response.data;
    });
    return promise;
  },
  get(resourceUrl,callback) {
    promise = axios.get(resourceUrl).then((response) => {
      callback(response.data);
      return response.data;    
    });
    return promise;
  },
  post(item) {
    let config = {
      method: 'post',
      url: item.url,
      data: JSON.stringify(item.param),
      headers:  {
        'X-Requested-With': item.headers ? item.headers :'XMLHttpRequest',
        crossDomain: true,
      },
      requestHeader: {
        crossDomain: true,
        'Content-Type': item.requestHeader ? item.requestHeader : 'application/json'
      },
    }
    promise = axios(config).then((response) => {
      return response.data;
    });
    return promise;
  },
  /**
   * 定义通用的请求函数
   * @item  {Object} 请求的参数主体   
   * @self  {Object} 需要处理的目标对象即从哪个对象调用此函数 
   * @changeKeyArr {Array} 需要改变的目标对象的key值组 需要和接口返回的字段对应
   */
  sendMyData(item, self, callback) {
    //若点击按钮需要缓冲状态则使用此方法
    if(item.loading) {
      self[item.loading] = true;
    }
    let isNeedOkMsg = item.isNeedOkMsg==false?item.isNeedOkMsg:true;
    let config = {
      method: 'post',
      url: item.url,
      param: item.param,
      headers: item.headers ? item.headers : 'XMLHttpRequest',
      requestHeader:item.requestHeader ? item.requestHeader :  'application/json'
    }
    this.fetch(config).then((res) => {
      if(res && res.code != 2000){
        self.$message({
          showClose: true,
          message: res.code + "：" + res.msg,
          type: 'error'
        });
      }
      if(item.loading) {
        self[item.loading] = false;
      }
      callback(res);
    }, (error) => {
      if(item.loading) {
        self[item.loading] = false;
      }
      //callback(error)
      self.$message({
        showClose: true,
        message:error.response?error.response.status + "：" + error.response.statusText:"服务器错误",
        type: 'error'
      });
      
    })
  }
}