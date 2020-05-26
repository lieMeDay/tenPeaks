// 接口调用函数
const request = (options) => {
  // let BaseUrl = "http://report.lvtutech.com/game"
  // let BaseUrl = "https://paoner.lvtutech.com/game"
  let BaseUrl = 'http://192.168.0.101:9898'
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
module.exports = {
  tool:request,
  timeShift:timeShift
}