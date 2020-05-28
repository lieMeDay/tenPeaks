//app.js
var utils = require('./utils/util.js')
App({
  onLaunch: function () {
    let that=this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let JSCODE = res.code
        utils.tool({
          url: "/run/shifeng/getOpenId",
          data: {
            code: JSCODE
          },
          load:true
        }).then(res => {
          // console.log(res)
          that.globalData.openId = res.data.data.openid
          if (that.CallbackOpenid) {
            // 如果有说明，onLoad中没有拿到openid，把结果当参数再传入回调中
            that.CallbackOpenid(res);
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    openId:null,
    userInfo: null
  }
})