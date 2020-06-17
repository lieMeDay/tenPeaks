// 图片上传头
// const imgUrl = "https://paoner.lvtutech.com/game"
const imgUrl="http://192.168.0.101:9898"
// const imgUrl="http://192.168.0.106:9898"

// 接口调用函数
const request = (options) => {
  // let BaseUrl = "https://paoner.lvtutech.com/game"
  let BaseUrl = 'http://192.168.0.101:9898'
  // let BaseUrl = 'http://192.168.0.106:9898'
  return new Promise((resolve, reject) => {
    if (!options.method) {
      options.method = "GET"
    }
    Object.assign(options, {
      url: BaseUrl + options.url,
      data: options.data,
      header: {
        "Content-Type": "application/json"
      },
      success: resolve,
      fail: reject,
      complete: (res) => {
        if (options.load) {
          wx.hideLoading({
            fail: (res) => {
              console.log('已关闭')
            },
          })
        }
      },
    })
    if (options.load) {
      wx.showLoading({
        title: '加载中...',
      })
    }
    wx.request(options)
  })
}

// 日期时间拼接转换
const timeShift = (t1, t2) => {
  let t = t1.substring(0, 10)
  let tt = t.split('-')
  let ttt = tt[0] + '.' + tt[1] + '.' + tt[2]
  let d = t2.substring(0, 10)
  let dd = d.split('-')
  let ddd = dd[0] + '.' + dd[1] + '.' + dd[2]
  return ttt + '-' + ddd
}
// 根据两点经纬度计算距离 单位(KM)
const getDistance = (lat1, lng1, lat2, lng2) => {
  var radLat1 = lat1 * Math.PI / 180.0;
  var radLat2 = lat2 * Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s;
}
//将时间戳转换成正常时间格式
const timeConvert = (timestamp) => {
  var date = new Date(timestamp);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  var d = date.getDate();
  d = d < 10 ? "0" + d : d;
  var h = date.getHours();
  h = h < 10 ? "0" + h : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;
  return y + "/" + m + "/" + d + " " + h + ":" + minute + ":" + second;
}
// 秒转时分秒
const formatSeconds = (time) => {
  let min = Math.floor(time % 3600)
  let hh = Math.floor(time / 3600) > 9 ? Math.floor(time / 3600) : '0' + Math.floor(time / 3600)
  let mm = Math.floor(min / 60) > 9 ? Math.floor(min / 60) : '0' + Math.floor(min / 60)
  let ss = time % 60 > 9 ? time % 60 : '0' + time % 60
  let val = hh + ':' + mm + ':' + ss
  return val
}

module.exports = {
  tool: request, // 接口调用函数
  imgUrl: imgUrl,
  timeShift: timeShift, // 日期时间拼接转换
  getDistance: getDistance, // 根据两点经纬度计算距离 单位(KM)
  timeConvert: timeConvert, //将时间戳转换成正常时间格式
  formatSeconds: formatSeconds, // 秒转时分秒
}