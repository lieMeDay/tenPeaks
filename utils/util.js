
// 接口调用函数
const request = (options) => {
  let BaseUrl = "https://paoner.lvtutech.com/game"
  // let BaseUrl = 'http://192.168.0.101:9898'
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
          wx.hideLoading()
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

// 图片上传头
const imgUrl = "https://paoner.lvtutech.com/game"
// const imgUrl="http://192.168.0.101:9898"

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
module.exports = {
  tool:request,
  imgUrl:imgUrl,
  timeShift:timeShift,
  getDistance:getDistance
}