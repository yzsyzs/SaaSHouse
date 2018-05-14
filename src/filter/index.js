import Vue from 'vue'
import moment from 'moment'

Vue.filter('time', function (value, formatString) {
  let fs = formatString || 'YYYY-MM-DD HH:mm'
  return moment(value).format(fs)
})
